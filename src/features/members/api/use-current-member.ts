import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useCurrentMember = () => {
  const data = useQuery(api.members.getCurrentMemberProfile);
  const isLoading = data === undefined;
  return { data, isLoading };
};
