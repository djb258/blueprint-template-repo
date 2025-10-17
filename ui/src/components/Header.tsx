// BLOCK MAP:
// - header-main-001: Main header container

import { BLOCK_IDS } from "@/lib/blockIds";

const Header = () => {
  return (
    /* BLOCK_ID: header-main-001 */
    <header 
      data-block-id={BLOCK_IDS.HEADER_MAIN}
      className="w-full border-b bg-card shadow-sm"
    >
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">
          Blueprint Engine Console
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Structured Blueprint Design Interface
        </p>
      </div>
    </header>
  );
};

export default Header;
