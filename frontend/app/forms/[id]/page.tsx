import { FormComponent } from "@/components/forms/view/FormComponent";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex w-full justify-center p-4">
      <Card className="flex w-full max-w-lg flex-col gap-2 p-4">
        <FormComponent type="input" />
        <FormComponent type="input" />
        <FormComponent type="input" />
        <FormComponent type="input" />
      </Card>
    </div>
  );
}
