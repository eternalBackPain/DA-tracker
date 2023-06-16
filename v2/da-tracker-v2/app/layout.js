import "./globals.css";
import Header from "./components/Header";

//You can also use layouts as a normal component (e.g. using a layout in the 'about' folder)


export const metadata = {
  title: "DA Tracker",
  description: "Spacially track Development Applications",
  keywords: "development, applications, tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <Header />
      <main className='container'>{children}</main>
      </body>
    </html>
  );
}
