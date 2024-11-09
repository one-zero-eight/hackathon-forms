"use client";

import { FormCard } from "@/components/forms/view/FormCard";
import { FormProvider } from "@/components/forms/view/FormContext";
import { FormResponsesProvider } from "@/components/forms/view/FormResponsesContext";

export default function Page() {
  return (
    <div className="flex w-full justify-center p-4">
      <FormProvider id="00">
        <FormResponsesProvider>
          <FormCard />
        </FormResponsesProvider>
      </FormProvider>
    </div>
  );
}
