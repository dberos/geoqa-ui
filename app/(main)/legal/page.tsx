import { headers } from "next/headers";
import Link from "next/link";

export default async function LegalPage() {
    await headers();
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <div
            id="privacy-policy"
            className="w-full mt-20 p-5 md:p-10 2xl:mt-5 2xl:p-30"
            >
                <h1 className="text-4xl font-bold">
                    Privacy Policy
                </h1>
                <h4 className="mt-5">
                    Last updated: May 22, 2025
                </h4>
                <ol className="list-decimal ml-6 mt-10 marker:font-bold marker:text-2xl space-y-10">
                    <li>
                        <h2 className="text-2xl font-bold">
                            Introduction
                        </h2>
                        <p className="mt-2 max-w-7xl 2k:text-lg 4k:text-xl 4k:max-w-[2000px]">
                            This Privacy Policy describes how your personal information is collected, used, and shared when you visit the GeoQA application.
                            Reading this privacy notice will help you understand your privacy rights and choices.
                            If you do not agree with our policies and practices, please do not use our application.
                            GeoQA is designed to offer a user interface for the GeoQA engine, which is a service that designed for research purposes, thus having no commercial use.
                        </p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-bold">
                            Information We Collect
                        </h2>
                        <p className="mt-2 max-w-7xl 2k:text-lg 4k:text-xl 4k:max-w-[2000px]">
                            When you visit our application, we automatically collect certain information about your GitHub or Google profile
                            that you used to sign in. This information includes your provided name if present or set as your username or email if not, GitHub or Google Id and profile picture.
                            This information is used to personalize your experience and enabling core functionalities of the application.
                            
                        </p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-bold">
                            Information We Store
                        </h2>
                        <p className="mt-2 max-w-7xl 2k:text-lg 4k:text-xl 4k:max-w-[2000px]">
                            Every time you sign in, we store the latest information in our database, under your user account.
                        </p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-bold">
                            Information We Share
                        </h2>
                        <p className="mt-2 max-w-7xl 2k:text-lg 4k:text-xl 4k:max-w-[2000px]">
                            We do not share your personal information with any third parties.
                        </p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-bold">
                            GDPR and Your Rights
                        </h2>
                        <p className="mt-2 max-w-7xl 2k:text-lg 4k:text-xl 4k:max-w-[2000px]">
                            We comply with the General Data Protection Regulation (GDPR) and other applicable data protection laws. 
                            We only process your personal data when signing into the application to enable its core functionalities.
                            There is no additional processing or profiling of your information.
                        </p>
                        <ul className="list-disc ml-8 mt-2 space-y-1">
                            <li>
                                You have the right to access your personal data,&nbsp; 
                                <Link href='/legal/personal-data' className="underline text-blue-500">
                                    from this page.
                                </Link>
                                 
                            </li>
                            <li>
                                You have the right to correct your personal data, by reauthenticating into the application.
                            </li>
                            <li>
                                You have the right to delete your personal data, by deleting your account.
                            </li>
                        </ul>
                        <p className="mt-2 max-w-7xl 2k:text-lg 4k:text-xl 4k:max-w-[2000px]">
                            If you have any other questions about how your data is handled,&nbsp;
                            <Link 
                            className="underline text-blue-500"
                            href="https://ai.di.uoa.gr/" 
                            target="_blank"
                            >
                                please contact us.
                            </Link>
                            &nbsp; If you remain unsatisfied, you have the right to lodge a complaint with the &nbsp;
                            <Link
                            className="underline text-blue-500"
                            href='https://www.dpa.gr/en'
                            target="_blank"
                            >
                             supervisory authority.
                            </Link>
                        </p>
                    </li>
                </ol>
            </div>
            <div
            id="cookie-policy"
            className="w-full mt-10 2xl:mt-5 px-5 md:px-10 2xl:px-30"
            >
                <h1 className="text-4xl font-bold">
                    Cookie Policy
                </h1>
                <h4 className="mt-5">
                    Last updated: May 22, 2025
                </h4>
                <ol className="list-decimal ml-6 mt-10 marker:font-bold marker:text-2xl space-y-10">
                    <li>
                        <h2 className="text-2xl font-bold">
                            What Are Cookies?
                        </h2>
                        <p className="mt-2 max-w-7xl 2k:text-lg 4k:text-xl 4k:max-w-[2000px]">
                            Cookies are small data files that are stored on your device when you visit a website or use a web application.
                            They are widely used to make websites work more efficiently, enhance functionality and provide information to the site owners.
                        </p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-bold">
                            How We Use Cookies
                        </h2>
                        <p className="mt-2 max-w-7xl 2k:text-lg 4k:text-xl 4k:max-w-[2000px]">
                            We use only essential cookies that are required for secure authentication and our application functionality.
                            These cookies are not used for tracking, analytics, or advertising purposes.
                        </p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-bold">
                            Cookies We Use
                        </h2>
                        <ul className="list-disc ml-8 mt-2 space-y-2 max-w-7xl 2k:text-lg 4k:text-xl 4k:max-w-[2000px]">
                            <li>
                                <strong>accessToken</strong> – Used to authenticate your session and provide secure access to the application.
                                It is stored securely in your browser and is not shared with any third parties.
                                It is valid for a limited time and automatically deleted in a day of inactivity.
                            </li>
                            <li>
                                <strong>refreshToken</strong> – Used to renew your session without the need to sign in again, when your access token expires.
                                It is stored securely in your browser and is not shared with any third parties.
                                It has two identifiers that helps us ensure it is valid for one time use only, and not getting compromised. 
                                It is valid for a limited time and automatically deleted in a day of inactivity.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h2 className="text-2xl font-bold">
                            Managing Cookies
                        </h2>
                        <p className="mt-2 max-w-7xl 2k:text-lg 4k:text-xl 4k:max-w-[2000px]">
                            Because our application uses only essential cookies, they cannot be disabled through cookie settings.
                            If you wish to stop using these cookies, please do not use our application
                        </p>
                    </li>
                    <li className="mb-20">
                        <h2 className="text-2xl font-bold">
                            Contact
                        </h2>
                        <p className="mt-2 max-w-7xl 2k:text-lg 4k:text-xl 4k:max-w-[2000px]">
                            If you have any questions or concerns regarding our use of cookies,&nbsp;
                            <Link
                                className="underline text-blue-500"
                                href="https://ai.di.uoa.gr/"
                                target="_blank"
                            >
                                please contact us.
                            </Link>
                        </p>
                    </li>
                </ol>
            </div>
        </main>
    )
}