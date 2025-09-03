import tables from "./tables"

export default interface Database {
    public: {
        Tables: typeof tables
    }
}
