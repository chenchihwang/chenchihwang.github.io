import Head from '@/components/Head';
import Nav from '@/components/Nav';

function Page({
  meta,
  children,
}: {
  meta: {
    title?: string;
    description?: string;
    image?: string;
  };
  children: React.ReactNode;
}) {
  const { title, description, image } = meta;
  return (
    <>
      <Head
        title={`${title ? `${title} - ` : ''}Alex Carpenter`}
        description={description}
        image={image}
      />
      <div className="max-w-screen-sm mx-auto mb-16 w-100">
        <Nav />
        {children}
      </div>
    </>
  );
}

function Header({ children }) {
  return <header className="space-y-3">{children}</header>;
}

function Title({
  children,
  decorate = true,
}: {
  children: React.ReactNode;
  decorate?: boolean;
}) {
  return (
    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
      {children}
      {decorate && (
        <span aria-hidden="true" className="ml-2 text-gray-400">
          ¬
        </span>
      )}
    </h1>
  );
}

function Description({ children }) {
  return <p className="text-xl text-gray-600 sm:text-2xl">{children}</p>;
}

function Content({ children }) {
  return <div className="mt-8 prose">{children}</div>;
}

Page.Header = Header;
Page.Title = Title;
Page.Description = Description;
Page.Content = Content;

export default Page;
