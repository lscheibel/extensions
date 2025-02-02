import { useEffect, useState } from "react";
import { SelectedWorkspace } from "../types/preferences";
import { Share } from "../types/SketchWorkspaceShare";
import { getShares } from "../utils/functions";

export default function useSearch(
  token: string | undefined,
  selectedWorkspace: SelectedWorkspace | undefined,
  query: string | undefined
): {
  data: Record<"shares", Share[]> | undefined;
  error?: string;
  isLoading: boolean;
} {
  const [data, setData] = useState<{ shares: Share[] }>({ shares: [] });
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let cancel = false;

  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (cancel || !token || !selectedWorkspace) {
        return;
      }

      setIsLoading(true);
      setError(undefined);

      try {
        const shares: Share[] | undefined = await getShares(token, selectedWorkspace, query);
        if (!cancel && shares) {
          setData({
            shares: shares,
          });
        } else if (shares === undefined) {
          setError('Launch "Set Workspace" first!');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error) {
        if (!cancel) {
          setError(error as string);
        }
      } finally {
        if (!cancel) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancel = true;
    };
  }, [query, token, selectedWorkspace]);

  return { data, error, isLoading };
}
