declare global {
    interface alter {
        name: string;
        id: string;
        fronting: boolean;
        totalFrontTime: number;
        lastFrontTime: number;
        lastFrontTimestamp: Date;
        percent: number;

        lastFrontTimes?: alterTimes;
        totalFrontTimes?: alterTimes;
    }

    interface alterTimes {
        days: number;
        hours: number;
        minutes: number;
    }
}

export { alter, alterTimes }
