import React from "react";
export function Footer() {

  return (
    <footer className="py-2 flex w-full flex-wrap items-center justify-center ">
      <div className="copyright flex w-full flex-wrap items-center justify-center gap-6 px-2">
        <div className="text-sm text-gray-600 flex items-center dark:text-white text-center">
          <p className="text-center"> © {new Date().getFullYear()} SmartLife. Bütün hüquqlar qorunur.</p>
        </div>
      </div>
    </footer>
  );
}


export default Footer;
