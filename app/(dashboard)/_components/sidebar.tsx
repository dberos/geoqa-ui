import Account from "./account";
import Add from "./add";
import Logo from "./logo";

const SideBar = () => {
    
    return ( 
        <aside className="h-screen w-72 flex flex-col border-r-1 bg-neutral-100 dark:bg-neutral-900">
            <Account />
            <Logo />
            <Add />
        </aside>
    );
}
 
export default SideBar;