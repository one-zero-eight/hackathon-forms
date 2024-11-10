"use client";

import { FormCard } from "@/components/forms/view/FormCard";
import { FormProvider } from "@/components/forms/view/FormContext";
import { FormResponsesProvider } from "@/components/forms/view/FormResponsesContext";
import { $api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const params = useParams();
  const search = useSearchParams();
  const key = search.get("key");

  const queryClient = useQueryClient();
  const { mutate: applyKey } = $api.useMutation(
    "post",
    "/as-respondee/form/by-invite/{key}",
    {
      onSettled: () => {
        queryClient.clear();
      },
    },
  );

  useEffect(() => {
    if (!key) return;
    applyKey({ params: { path: { key } } });
  }, [applyKey, key]);

  return (
    <div className="flex w-full justify-center p-4">
      <FormProvider id={params.id as string}>
        <FormResponsesProvider>
          <FormCard />
        </FormResponsesProvider>
      </FormProvider>
    </div>
  );
}
