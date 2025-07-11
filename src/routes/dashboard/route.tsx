import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import {
  Menu,
  Package2,
  Package,
  ShoppingCart,
  DollarSign,
  CreditCard,
  Laptop,
  Smartphone,
  Mail,
  Wallet,
  Building,
  User,
  FileText,
  BellRing,
  LogOut,
  SquareUserRound,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Data navigasi dari Anda
const navGroups = [
  {
    title: 'Data',
    menu: [
      { title: 'Device', url: '/dashboard/device', icon: Laptop },
      { title: 'Simcard', url: '/dashboard/simcard', icon: Smartphone },
      { title: 'Email', url: '/dashboard/email', icon: Mail },
    ],
  },
  {
    title: 'E-Wallet',
    menu: [
      { title: 'Jenis E-Wallet', url: '/dashboard/ewallet-type', icon: Wallet },
      { title: 'Akun E-Wallet', url: '/dashboard/ewallet', icon: CreditCard },
      {
        title: 'Topup E-Wallet',
        url: '/dashboard/ewallet-topup',
        icon: DollarSign,
      },
    ],
  },
  {
    title: 'Produk',
    menu: [
      { title: 'Produk', url: '/dashboard/product', icon: Package },
      {
        title: 'Varian Produk',
        url: '/dashboard/product-variant',
        icon: Package2,
      },
    ],
  },
  {
    title: 'Platform',
    menu: [
      { title: 'Platform', url: '/dashboard/platform', icon: Building },
      {
        title: 'Produk Platform',
        url: '/dashboard/platform-product',
        icon: ShoppingCart,
      },
    ],
  },
  {
    title: 'Akun',
    menu: [
      { title: 'Akun Produk', url: '/dashboard/product-account', icon: User },
      {
        title: 'User Akun',
        url: '/dashboard/product-account-user',
        icon: SquareUserRound,
      },
    ],
  },
  {
    title: 'Laporan',
    menu: [
      { title: 'Transaksi', url: '/dashboard/transaction', icon: FileText },
      { title: 'Notifikasi', url: '/dashboard/notification', icon: BellRing },
    ],
  },
]

const AppLogo = () => (
  <p className="flex items-center gap-2 font-bold">Volve Capital</p>
)

// Komponen untuk me-render konten navigasi agar tidak duplikat
const NavContent = () => (
  <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
    {navGroups.map((group) => (
      <div key={group.title} className="mb-4">
        <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {group.title}
        </h3>
        {group.menu.map((item) => (
          <Link
            key={item.url}
            to={item.url}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            activeProps={{
              className: 'bg-blue-100 text-blue-700',
            }}
          >
            <item.icon className="size-4" />
            {item.title}
          </Link>
        ))}
      </div>
    ))}
  </nav>
)

// Komponen utama untuk layout dashboard
function DashboardLayout() {
  const handleLogout = () => {
    console.log('logout')
  }
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* --- Sidebar Desktop --- */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <AppLogo />
          </div>
          <div className="flex-1 overflow-auto py-4">
            <NavContent />
          </div>
        </div>
      </div>

      {/* --- Konten Utama & Header Mobile --- */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* --- Trigger Sidebar Mobile --- */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="flex h-14 items-center border-b px-4">
                <AppLogo />
              </div>
              <div className="flex-1 overflow-auto py-4">
                <NavContent />
              </div>
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1">
            {/* Bisa ditambahkan search bar di sini jika perlu */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full cursor-pointer"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=volvecapital&background=c7d2fe&color=3730a3`}
                  />
                  <AvatarFallback>VC</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>admin@volvecapital.com</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 size-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {/* --- Tempat render konten halaman --- */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// Membuat dan mengekspor route
export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})
