import PaymentProcess from "./PaymentProcess";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <PaymentProcess id={id} />;
}
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 60;