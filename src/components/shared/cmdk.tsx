"use client";

import React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  PersonIcon,
  CodeIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  ClockIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { UserType } from "@/lib/types";
import { PencilLine, PencilLineIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { getSearchFeed } from "@/lib/fetchers/getSearchFeeds";


interface GroupType {
  name: string;
  items: ItemType[];
};

interface ItemType {
  id: string;
  title?: string;
  text?: string;
  username?: string;
};

export default function Cmdk({ user }: { user: UserType | null }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 300)

  const [loading, setLoading] = React.useState(false);
  console.log(loading)
  const [data, setData] = React.useState<GroupType[]>([])


  console.log(data)

  React.useEffect(() => {
    if (debouncedQuery.length <= 0) {
      setData([])
      return
    }

    async function fetchData() {
      setLoading(true)
      const res = await getSearchFeed({ query: debouncedQuery })
      console.log(res)
      if (res?.error) {
        setLoading(false)
        return
      }
      if (res?.data) {
        setData(res.data)
      }
      setLoading(false)
    }

    void fetchData()
  }, [debouncedQuery])


  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])


  return (
    <>
      <div className="w-full flex-1 md:w-auto md:flex-none">
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="inline-flex items-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-80 lg:w-[700px]"
        >
          <span className="hidden lg:inline-flex">Search in Feed...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-1.7 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>
      <CommandDialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open)
          if (!open) {
            setQuery("")
          }
        }}
      >
        <CommandInput
          placeholder="Search feed..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty
            className={cn(loading ? "hidden" : "py-6 text-center text-sm")}
          >
            No results found
          </CommandEmpty>
          {loading ? (
            <div className="space-y-1 overflow-hidden px-1 py-2">
              <Skeleton className="h-4 w-10 rounded" />
              <Skeleton className="h-8 rounded-sm" />
              <Skeleton className="h-8 rounded-sm" />
            </div>
          ) : (
            data?.map((group) => (
              <CommandGroup
                key={group?.name}
                className="capitalize"
                heading={group.name}
              >
                {group?.items?.map((item) => {
                  return (
                    <CommandItem
                      key={item.id}
                      className="h-9"
                      value={item.title || item.text || item.username}
                      onSelect={() => {
                        runCommand(() => router.push(`/feed/${item.id}`))
                      }}
                    >
                      <PencilLineIcon
                        className="mr-2.5 size-3 "
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.title || item.text || item.username}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}