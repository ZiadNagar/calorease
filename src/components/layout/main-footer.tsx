/**
 * MainFooter - Site-wide footer component
 */
const MainFooter = () => {
  return (
    <footer className="">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground border-t border-border px-4 sm:px-6 py-4 lg:py-8 mt-auto">
        <p>© {new Date().getFullYear()} CalorEase. All rights reserved.</p>
        <p>
          Crafted by{" "}
          <a
            href="https://ziadelnagar-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground hover:text-primary transition-colors duration-200"
          >
            Ziad Elnagar
          </a>
        </p>
      </div>
    </footer>
  );
};

export { MainFooter };
