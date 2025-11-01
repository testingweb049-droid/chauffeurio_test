
import OrderPage from "./OrderPage";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = params;

  return <OrderPage id={id} />;
}
