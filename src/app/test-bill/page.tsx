import { CustomerBill } from "@/components/customerBill";

export default function TestBill() {
  const testData = {
    name: "Juan Pérez",
    phoneNumber: "98765432",
    amountPaid: 150,
    cardBrand: "Visa",
    lastFourDigits: "1234",
    verification: "123456",
    reference: "f07504cd123"
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Test PDF Generation</h1>
        <CustomerBill {...testData} />
      </div>
    </div>
  );
}
