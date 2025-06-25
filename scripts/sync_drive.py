import os
import json
import base64
from datetime import datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io
import re

def get_google_drive_service():
    service_account_info = json.loads(
        base64.b64decode(os.environ['GOOGLE_SERVICE_ACCOUNT_KEY']).decode('utf-8')
    )
    credentials = service_account.Credentials.from_service_account_info(
        service_account_info,
        scopes=['https://www.googleapis.com/auth/drive.readonly']
    )
    return build('drive', 'v3', credentials=credentials)

def download_file(service, file_id, filename):
    try:
        request = service.files().get_media(fileId=file_id)
        fh = io.BytesIO()
        downloader = MediaIoBaseDownload(fh, request)
        done = False
        while not done:
            status, done = downloader.next_chunk()
        return fh.getvalue().decode('utf-8')
    except Exception as e:
        print(f"Error downloading file {filename}: {e}")
        return None

def lint_journal_md(md_content):
    # Extract the metadata block
    meta_match = re.match(r'(?s)^---.*?---', md_content)
    if not meta_match:
        print("No metadata block found, skipping lint.")
        return None
    meta = meta_match.group(0)
    # Find the first '# journal' header
    journal_idx = md_content.lower().find('# journal')
    if journal_idx == -1:
        print("No '# journal' header found, skipping lint.")
        return None
    # Find the start of the line after '# journal'
    after_journal = md_content.find('\n', journal_idx)
    if after_journal == -1:
        print("No content after '# journal', skipping lint.")
        return None
    # Compose linted content
    linted = meta.strip() + '\n\n' + md_content[after_journal+1:].lstrip()
    return linted

def sync_journal_entries():
    service = get_google_drive_service()
    folder_id = os.environ['GOOGLE_DRIVE_FOLDER_ID']
    results = service.files().list(
        q=f"'{folder_id}' in parents and mimeType='text/markdown'",
        fields="files(id,name,modifiedTime)",
        orderBy="modifiedTime desc"
    ).execute()
    files = results.get('files', [])
    print(f"Found {len(files)} markdown files in Google Drive")
    changes_made = False
    for file in files:
        filename = file['name']
        file_id = file['id']
        if not filename.endswith('.md'):
            continue
        local_path = f"src/content/notes/{filename}"
        drive_mtime = datetime.fromisoformat(file['modifiedTime'].replace('Z', '+00:00')).timestamp()
        content = download_file(service, file_id, filename)
        if not content:
            continue
        linted_content = lint_journal_md(content)
        if not linted_content:
            print(f"Skipping {filename} due to linting error.")
            continue
        # Only update if changed or new
        if os.path.exists(local_path):
            with open(local_path, 'r', encoding='utf-8') as f:
                local_content = f.read()
            if local_content == linted_content:
                print(f"Skipping {filename} - local version is up to date")
                continue
        os.makedirs("src/content/notes", exist_ok=True)
        with open(local_path, 'w', encoding='utf-8') as f:
            f.write(linted_content)
        os.utime(local_path, (drive_mtime, drive_mtime))
        print(f"Updated {filename} (linted)")
        changes_made = True
    return changes_made

if __name__ == "__main__":
    if sync_journal_entries():
        print("Changes detected - will commit and push")
        exit(0)
    else:
        print("No changes detected")
        exit(1) 