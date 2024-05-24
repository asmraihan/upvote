
import React from "react";
import {
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth.actions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ProfileDropdown({ session }: any) {

    const router = useRouter();

    const logOut = async () => {
        await signOut();
        router.refresh();
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <Avatar className='size-8'>
                        <AvatarImage src={session?.user?.profilePictureUrl} />
                        <AvatarFallback className='font-semibold'>
                            {session?.user?.username[0]?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                    </Avatar>

                    <span className="ml-2">{session?.username}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex justify-between">
                    <div className="text-xs font-medium">{session?.user?.name ? session?.user?.name : "User"}</div>
                    <Badge>Member</Badge>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={() => router.push(`/profile/${session?.user?.id}`)}>
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span>Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={() => logOut()}>
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}