import fs from "fs";
import matter from "gray-matter";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import dynamic from "next/dynamic";
import prism from "mdx-prism";
import path from "path";
import { screencastFilePaths, SCREENCASTS_PATH } from "../../lib/mdxUtils";
import Head from "@/components/Head";
import Page from "@/components/Page";
import Header from "@/components/Header";
import Video from "@/components/Video";
import MDXComponents from "@/components/MDXComponents";

export default function Screencast({ source, frontMatter }) {
  const content = hydrate(source, { components: MDXComponents });

  return (
    <>
      <Head title={frontMatter.title} description={frontMatter.description} />
      <Page title='Screencasts'>
        <article>
          <Header>
            <Header.Title decorate={false}>{frontMatter.title}</Header.Title>
            <Header.Description>{frontMatter.description}</Header.Description>
          </Header>
          <div className='mt-8 space-y-3'>
            <Video id={frontMatter.id} />
            {content}
          </div>
        </article>
      </Page>
    </>
  );
}

export const getStaticProps = async ({ params }) => {
  const screencastFilePath = path.join(SCREENCASTS_PATH, `${params.slug}.mdx`);
  const source = fs.readFileSync(screencastFilePath);

  const { content, data } = matter(source);

  const mdxSource = await renderToString(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [prism],
    },
    scope: data,
  });

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
  };
};

export const getStaticPaths = async () => {
  const paths = screencastFilePaths
    // Remove file extensions for page paths
    .map((path) => path.replace(/\.mdx?$/, ""))
    // Map the path into the static paths object required by Next.js
    .map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};
