
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
import { UserType } from "@/lib/types";

export default function ProfileDropdown({ user }: { user: UserType | null }) {
    console.log(user)
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
                        <AvatarImage src={user?.profilePictureUrl} />
                        <AvatarFallback className='font-semibold'>
                            {user?.username[0]?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                    </Avatar>

                    <span className="ml-2">{user?.username}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex justify-between">
                    <div className="text-xs font-medium">{user?.username ? user?.username : "User"}</div>
                    <Badge>Member</Badge>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={() => router.push(`/profile/${user?.username}`)}>
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