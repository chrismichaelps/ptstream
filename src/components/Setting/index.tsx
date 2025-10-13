import { useState } from "react";
import { Effect, pipe } from "effect";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { Settings } from "lucide-react";

import i18n from "../../localization/i18n";
import { UI_DIMENSIONS } from "../../../packages/constants";

export default function Setting() {
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const handleChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) =>
    pipe(
      Effect.sync(() => event.target.value),
      Effect.tap((newLang) => Effect.sync(() => i18n.changeLanguage(newLang))),
      Effect.tap((newLang) => Effect.sync(() => setSelectedLang(newLang))),
      Effect.runSync
    );

  return (
    <Dropdown
      radius="sm"
      classNames={{
        base: "before:bg-default-200",
        content:
          "p-0 border-small border-divider bg-background/80 backdrop-blur-md dark:bg-default-100/50",
        trigger: "p-0",
      }}
    >
      <DropdownTrigger>
        <Button
          variant="light"
          size="sm"
          className="w-10 h-10 rounded-lg transition-all duration-300 group hover:bg-default-100 dark:hover:bg-default-50"
        >
          <Settings
            size={UI_DIMENSIONS.ICONS.SMALL}
            className="transition-transform duration-300 group-hover:rotate-[360deg] text-default-600"
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu className="min-w-[200px] p-2" aria-label="Settings options">
        <DropdownSection aria-label="Preferences" className="px-2 py-1">
          <DropdownItem
            isReadOnly
            key="lang"
            className="cursor-default data-[hover=true]:bg-transparent"
            classNames={{
              base: "py-2",
              title:
                "text-default-700 dark:text-default-500 text-sm font-medium",
            }}
            endContent={
              <select
                className="z-10 outline-none min-w-[100px] px-2 py-1 rounded-md text-sm 
                  border-small border-default-300 dark:border-default-200 
                  bg-default-100/50 dark:bg-default-50/50 
                  hover:bg-default-200/50 dark:hover:bg-default-100/50
                  transition-colors"
                id="lang"
                name="lang"
                value={selectedLang}
                onChange={handleChangeLanguage}
              >
                <option value="de">🇩🇪 Deutsch</option>
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Español</option>
                <option value="fr">🇫🇷 Français</option>
              </select>
            }
          >
            {t("Language_Select")}
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
