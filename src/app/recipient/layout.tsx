import { RecipientNavbar } from "@/features/recipient/components/recipient-navbar";

interface Props {
  children: React.ReactNode;
}

const RecipientLayout = ({ children }: Props) => {
  return (
    <div>
      <RecipientNavbar />
      <main>{children}</main>
    </div>
  );
};
export default RecipientLayout;
