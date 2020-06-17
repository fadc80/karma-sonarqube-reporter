import 'karma';

export interface SonarqubeReporterConfiguration {
    /** test files folder */
    basePath: string;
    /** test files glob pattern */
    filePattern: string;
    /** test files encoding */
    encoding: string;
    /** report destination */
    outputFolder: string;
    /** report for Sonarqube < 6.2 (disabled) */
    legacyMode?: boolean;
    /**
     * report name callback, accepts also a string to generate a single file
     *
     * Report metadata array:
     * - metadata[0] = browser name
     * - metadata[1] = browser version
     * - metadata[2] = plataform name
     * - metadata[3] = plataform version
     */
    reportName: ((metadata: string[]) => string) | string;
}

declare module 'karma' {
    interface ConfigOptions {
        sonarqubeReporter?: SonarqubeReporterConfiguration;
    }
}
