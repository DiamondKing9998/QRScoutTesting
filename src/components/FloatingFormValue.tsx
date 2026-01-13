import { useQRScoutState } from "@/store/store";
import React from "react";
import { getCachedTeamName } from "../lib/teamNameCache";
import { getCachedTeamLogo } from "../lib/teamLogoCache";
import { getScheduleHistory } from "@/lib/blueAllianceApi";

export function FloatingFormValue() {
    const { showField, codeValue } = useQRScoutState(state => ({
        showField: state.formData.floatingField.show,
        codeValue: state.formData.floatingField.codeValue
    }));
    const fieldValues = useQRScoutState(state => state.fieldValues);
    
    // LEFT SIDE: Manual team number from form field
    const manualTeamNumber = fieldValues.filter(f => f.code === codeValue)[0]?.value;
    
    // Get match number and robot position from form
    const matchNumber = fieldValues.find(f => f.code === 'matchNumber')?.value;
    const robotPosition = fieldValues.find(f => f.code === 'robot')?.value || '';
    
    // Determine color for scouted team
    let scoutedPositionColor = '#fff';
    
    if (typeof robotPosition === 'string') {
        if (robotPosition.startsWith('R')) {
            scoutedPositionColor = '#d32f2f';
        } else if (robotPosition.startsWith('B')) {
            scoutedPositionColor = '#1976d2';
        }
    }
    
    // RIGHT SIDE: Determine team number from schedule based on match + position
    const [scheduleTeamNumber, setScheduleTeamNumber] = React.useState<string>("");
    
    React.useEffect(() => {
        if (!matchNumber || !robotPosition) {
            setScheduleTeamNumber("");
            return;
        }

        // Get all schedule history
        const allSchedules = getScheduleHistory();
        
        // Find the match in any cached schedule
        let foundTeam = "";
        for (const historyItem of allSchedules) {
            const match = historyItem.schedule.find(m => m.matchNumber === Number(matchNumber));
            if (match) {
                // Map position to team number (use the SAME position, not opposing)
                const positionMap: Record<string, string> = {
                    'R1': match.red1,
                    'R2': match.red2,
                    'R3': match.red3,
                    'B1': match.blue1,
                    'B2': match.blue2,
                    'B3': match.blue3,
                };
                foundTeam = positionMap[robotPosition] || "";
                if (foundTeam && foundTeam !== '—') {
                    break;
                }
            }
        }
        
        setScheduleTeamNumber(foundTeam);
    }, [matchNumber, robotPosition]);
    
    // Determine position color
    const positionColor = robotPosition.startsWith('R') ? '#d32f2f' : robotPosition.startsWith('B') ? '#1976d2' : '#fff';
    const positionColorLabel = robotPosition.startsWith('R') ? 'Red' : robotPosition.startsWith('B') ? 'Blue' : '';
    const positionNumber = robotPosition.slice(1);
    
    // LEFT SIDE: Team name/logo for manual team number
    const [manualTeamName, setManualTeamName] = React.useState<string>("");
    const [manualTeamLogo, setManualTeamLogo] = React.useState<string>("");

    React.useEffect(() => {
        let isMounted = true;
        async function fetchManualTeamInfo() {
            if (manualTeamNumber && !isNaN(Number(manualTeamNumber))) {
                try {
                    const [name, logo] = await Promise.all([
                        getCachedTeamName(Number(manualTeamNumber)),
                        getCachedTeamLogo(Number(manualTeamNumber)),
                    ]);
                    if (isMounted) {
                        setManualTeamName(name);
                        setManualTeamLogo(logo);
                    }
                } catch {
                    if (isMounted) {
                        setManualTeamName("");
                        setManualTeamLogo("");
                    }
                }
            } else {
                setManualTeamName("");
                setManualTeamLogo("");
            }
        }
        fetchManualTeamInfo();
        return () => { isMounted = false; };
    }, [manualTeamNumber]);

    // RIGHT SIDE: Team name/logo for schedule-based team
    const [scheduleTeamName, setScheduleTeamName] = React.useState<string>("");
    const [scheduleTeamLogo, setScheduleTeamLogo] = React.useState<string>("");

    React.useEffect(() => {
        let isMounted = true;
        async function fetchScheduleTeamInfo() {
            if (scheduleTeamNumber && !isNaN(Number(scheduleTeamNumber))) {
                try {
                    const [name, logo] = await Promise.all([
                        getCachedTeamName(Number(scheduleTeamNumber)),
                        getCachedTeamLogo(Number(scheduleTeamNumber)),
                    ]);
                    if (isMounted) {
                        setScheduleTeamName(name);
                        setScheduleTeamLogo(logo);
                    }
                } catch {
                    if (isMounted) {
                        setScheduleTeamName("");
                        setScheduleTeamLogo("");
                    }
                }
            } else {
                setScheduleTeamName("");
                setScheduleTeamLogo("");
            }
        }
        fetchScheduleTeamInfo();
        return () => { isMounted = false; };
    }, [scheduleTeamNumber]);

    const className =
        "sticky top-5 w-full space-y-1.5 p-2 bg-primary mb-2 rounded-xl leading-none text-primary-foreground font-twitchy " +
        (showField ? "flex" : "hidden");

    return (
        <div className={className} style={{ justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            {/* Left: Manual team info from config field */}
            <div style={{ display: 'flex', alignItems: 'center', height: 40, minHeight: 40 }}>
                {manualTeamLogo && (
                    <img
                        src={manualTeamLogo}
                        alt="Team Logo"
                        style={{
                            width: 32,
                            height: 32,
                            objectFit: 'contain',
                            marginRight: 12,
                            background: scoutedPositionColor,
                            borderRadius: 6,
                            display: 'block',
                        }}
                    />
                )}
                <span style={{ display: 'flex', alignItems: 'center', height: '100%', fontSize: '1.5rem' }}>
                    {manualTeamNumber}
                    {manualTeamName && (
                        <span style={{ marginLeft: 8, fontWeight: 500, fontSize: '1.3125rem' }}>
                            {"- "}{manualTeamName}
                        </span>
                    )}
                </span>
            </div>

            {/* Right: Schedule-based team info with position/color */}
            {scheduleTeamNumber && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: 40,
                        minHeight: 40,
                        backgroundColor: positionColor,
                        padding: '0 12px',
                        borderRadius: 6,
                        gap: 8,
                    }}
                >
                    {scheduleTeamLogo && (
                        <img
                            src={scheduleTeamLogo}
                            alt="Schedule Team Logo"
                            style={{
                                width: 28,
                                height: 28,
                                objectFit: 'contain',
                                background: '#fff',
                                borderRadius: 4,
                                display: 'block',
                            }}
                        />
                    )}
                    <span style={{ fontWeight: 700, fontSize: '1.3125rem' }}>
                        {positionColorLabel} {positionNumber}: {scheduleTeamNumber}
                        {scheduleTeamName && (
                            <span style={{ marginLeft: 6, fontWeight: 500, fontSize: '1.3125rem' }}>
                                - {scheduleTeamName}
                            </span>
                        )}
                    </span>
                </div>
            )}
        </div>
    );
}