import { google } from "@/lib/lucia/oauth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prismaClient";
import { lucia } from "@/lib/lucia/luciaAuth";


interface GoogleUser {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    picture: string;
    locale: string;
}


export const GET = async (req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const searchParams = url.searchParams;

        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code || !state) {
            return Response.json(
                { error: "Invalid request1" },
                { status: 400 }
            )
        }

        const codeVerifier = cookies().get("codeVerifier")?.value
        const savedState = cookies().get("state")?.value

        if (!codeVerifier || !savedState) {
            return Response.json(
                { error: "Invalid request2" },
                { status: 400 }
            )
        }

        if (state !== savedState) {
            return Response.json(
                { error: "Invalid request3" },
                { status: 400 }
            )
        }

        const { accessToken, idToken, refreshToken, accessTokenExpiresAt } = await google.validateAuthorizationCode(code, codeVerifier)

        const googleRes = await fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            method: "GET"
        }
        )
        const googleData = (await googleRes.json()) as GoogleUser
        console.log(googleData)

        const user = await prisma.user.findFirst({
            where: {
                id: googleData.id
            }
        })

        let session = null;

        if (!user) {
            const createdUser = await prisma.user.create({
                data: {
                    id: googleData.id,
                    username: googleData.name,
                    profilePictureUrl: googleData.picture
                }
            })

            session = await lucia.createSession(createdUser?.id, {});

            console.log(createdUser, "createdUser")

            if (!createdUser) {
                return Response.json(
                    { error: "Failed to create user" },
                    { status: 500 }
                )
            }

            const createdOAuthAccount = await prisma.oAuthAccount.create({
                data: {
                    id: googleData.id,
                    accessToken: accessToken,
                    provider: "google",
                    providerUserId: googleData.id,
                    refreshToken: refreshToken,
                    expiresAt: accessTokenExpiresAt,
                    userId: createdUser.id
                }
            })

            if (!createdOAuthAccount) {
                return Response.json(
                    { error: "Failed to create OAuth Account" },
                    { status: 500 }
                )
            }
        } else {
            const updatedOAuthAccountRes = await prisma.oAuthAccount.update({
                where: {
                    id: googleData.id
                },
                data: {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    expiresAt: accessTokenExpiresAt
                }
            })

            session = await lucia.createSession(user.id, {});


            if (!updatedOAuthAccountRes) {
                return Response.json(
                    { error: "Failed to update OAuth Account" },
                    { status: 500 }
                )
            }
        }


        const sessionCookie = lucia.createSessionCookie(session.id);

        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );

        cookies().set(
            "state", "", {
            expires: new Date(0),
            }
        )

        cookies().set(
            "codeVerifier", "", {
            expires: new Date(0),
            }
        )

        return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL), {
            status: 302
        })
    } catch (error: any) {
        return Response.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
