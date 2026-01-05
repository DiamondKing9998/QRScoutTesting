
import { useQRScoutState } from "@/store/store";
import React from "react";
import { getCachedTeamName } from "../lib/teamNameCache";
import { getCachedTeamLogo } from "../lib/teamLogoCache";

export function FloatingFormValue() {
    const { showField, codeValue } = useQRScoutState(state => ({
        showField: state.formData.floatingField.show,
        codeValue: state.formData.floatingField.codeValue
    }));
    const teamNumber = useQRScoutState(state => state.fieldValues).filter(f => f.code === codeValue)[0]?.value;
    const [teamName, setTeamName] = React.useState<string>("");
    const [teamLogo, setTeamLogo] = React.useState<string>("");

    React.useEffect(() => {
        let isMounted = true;
        async function fetchNameAndLogo() {
            if (teamNumber && !isNaN(Number(teamNumber))) {
                try {
                    const [name, logo] = await Promise.all([
                        getCachedTeamName(Number(teamNumber)),
                        getCachedTeamLogo(Number(teamNumber)),
                    ]);
                    if (isMounted) {
                        setTeamName(name);
                        setTeamLogo(logo);
                    }
                } catch {
                    if (isMounted) {
                        setTeamName("");
                        setTeamLogo("");
                    }
                }
            } else {
                setTeamName("");
                setTeamLogo("");
            }
        }
        fetchNameAndLogo();
        return () => { isMounted = false; };
    }, [teamNumber]);

    const className =
        "sticky top-5 w-1/2 sm:w-full space-y-1.5 p-2 bg-primary mb-2 rounded-xl leading-none text-primary-foreground font-rhr-ns " +
        (showField ? "block" : "hidden");

    return (
        <div className={className} style={{ display: 'flex', alignItems: 'center' }}>
            {teamLogo && (
                <img
                    src={teamLogo}
                    alt="Team Logo"
                    style={{ width: 32, height: 32, objectFit: 'contain', marginRight: 12, background: '#fff', borderRadius: 6 }}
                />
            )}
            <span>
                {teamNumber}
                {teamName && (
                    <span style={{ marginLeft: 8, fontWeight: 500 }}>
                        {"- "}{teamName}
                    </span>
                )}
            </span>
        </div>
    );
}