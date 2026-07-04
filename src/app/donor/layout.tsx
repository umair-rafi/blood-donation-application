import { DonorNavbar } from "@/features/donor/components/donor-navbar";

interface Props {
  children: React.ReactNode;
}

const DonorLayout = ({ children }: Props) => {
  return (
    <div>
      <DonorNavbar />
      <main>{children}</main>
    </div>
  );
};
export default DonorLayout;
