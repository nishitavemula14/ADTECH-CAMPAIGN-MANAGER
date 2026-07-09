import {NavLink, Outlet, useLocation } from "react-router-dom";
import {BarChart3, ListChecks, PlusCircle } from "lucide-react";
import ThemeSwitcher from "../molecules/themeSwitcher.jsx";

const navItems =[
    {to: "/", label: "Dashboard", icon: BarChart3, isActive: (pathname) => pathname === "/"},
    {
        to:"/campaigns",
        label:"Campaigns",
        icon: ListChecks,
        isActive: (pathname) => pathname === "/campaigns" || pathname.startsWith("/campaigns")
    },
    { to: "/campaigns/new", label: "Create Campaign", icon: PlusCircle, isActive: (pathname) => pathname === "/campaigns/new" },
];

export default function AppLayout() {
    const { pathname} = useLocation();

    return (
        <div className="grid min-h-screen grid-cols-[250px_minmax(0,1fr)] overflow-x-hidden bg-background text-foreground max-[840px]:grid-cols-1">
            <aside className="flex flex-col gap-7 border-r border-border bg-card px-[18px] py-6 max-[840px]:sticky max-[840px]:top=- max-[840px]:top-0 max-[840px]:z-[2] max-[840px]:grid max-[840px]:grid-cols-[minmax(0,1fr)_auto] max-[840px]:gap-4 max-[840px]:border-r-0 max-[840px]:border-b max-[840px]:p-3.5">
                <div className="flex min-w-0 items-center gap-3 max-[520px]:items-start">
                    <span className="grid h-[46px] w-[46px] flex-[0_0_46px] place-items-center rounded-md bg-primary text-[0.76rem] font-black leading-none text-primary-foreground shadow-sm max-[520px]:h-[42px] max-[520px]:w-[42px] max-[520px]:basis-[42px]"
                    aria-hidden="true"
                 >
                    ACM
                 </span>
                 <div>
                    <strong className="block">AdTech</strong>
                    <span className="block text-[0.88rem] text-[var(--text-muted)]">Campaign Manager</span>
                </div>
                </div>
                <nav className="grid gap-1.5 max-[840px]:col-span-full max-[840px]:grid-cols-3" aria-label="Main navigation">
                        {navItems.map(({to, label, icon: Icon, isActive}) => (
                            <NavLink
                               key={to}
                               to={to}
                               className={[
                                  "flex min-h-[42px] items-center gap-2.5 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground max-[840px]:justify-center max-[520px]:px-2", 
                                  isActive(pathname) ? "bg-accent text-accent-foreground" : "",
                               ]
                                 .filter(Boolean)
                                 .join(" ")}
                            >
                                <Icon size={18} aria-hidden="true" />
                                <span className="max-[520px]:hidden">{label}</span>  
                            </NavLink>     
                        ))}
                        </nav>

                        <div className="mt-auto flex justify-start max-[840px]:col-start-2 max-[840px]:row-start-1 max-[840px]:mt-0 max-[840px]:items-center max-[840px]:justify-end">
                            <ThemeSwitcher/>
                        </div>
            </aside>

            <main className="min-w-0 overflow-x-hidden p-[34px] max-[840px]:px-3.5 max-[840px]:py-[22px] [&:has(.dashboard-page)]:py-6">
                <Outlet />
            </main>
        </div>
    );
}


        



