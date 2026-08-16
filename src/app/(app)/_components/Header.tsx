import { auth } from "~/server/auth"
import { SignOutButton } from "./SignOutButton"
import Link from "next/link"

export default async function Header({ children }: { children?: React.ReactNode }) {
    const session = await auth()

    return (
        <header className="border bg-gray-100 px-8 flex items-center justify-between h-14" >
            <div className="flex items-center gap-5">
                {children}
                <Link href="/">
                    <span className="text-sm font-medium tracking-widest uppercase text-gray-400 hover:text-gray-600 transition-colors">
                        Test
                    </span>
                </Link>
            </div>
            <div className="flex items-center gap-6">
                {session?.user && (
                    <span className="text-sm text-gray-600">
                        <span className="font-light italic text-gray-400">Hello, </span>
                        <span className="font-semibold text-gray-800">
                            {session.user.login}
                        </span>
                    </span>
                )}
                <SignOutButton />
            </div>
        </header >
    )
}