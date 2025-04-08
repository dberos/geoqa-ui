const Footer = () => {
    return ( 
        <footer className="w-full h-30 md:h-40 2k:h-64 4k:h-80 border-t-1 p-6 2k:p-8 flex items-center justify-center flex-col gap-y-2 2k:gap-y-5">
            <p className="text-xs leading-4 2k:text-lg 2k:leading-6 4k:text-2xl 4k:leading-7 text-muted-foreground text-center">
                Department of Informatics & Telecommunications
                <br />
                National and Kapodistrian University of Athens, Greece
            </p>
            <p className="text-base 2k:text-xl 4k:text-3xl text-muted-foreground">
                &copy; 2025 AI Team
            </p>
        </footer>
    );
}
 
export default Footer;