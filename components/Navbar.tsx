"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavbarProps {
  title: string
}

export default function Navbar({ title }: NavbarProps) {
  const pathname = usePathname()

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link href="/people">{title}</Link>
      </div>
      <div className="navbar-menu">
        <Link href="/people" className={pathname === "/people" ? "active" : ""}>
          People List
        </Link>
        <Link href="/people/add" className={pathname === "/people/add" ? "active" : ""}>
          Add Person
        </Link>
      </div>
    </nav>
  )
}
