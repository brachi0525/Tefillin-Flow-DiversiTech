'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link> | 
      <Link href="/about">About</Link> | 
      <Link href="/signup">Signup</Link> |
      <Link href="/donate">Donate</Link> |
      <Link href="/gallery">Gallery</Link> |

    </nav>
  );
}

