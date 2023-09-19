import React, { useState } from "react";

export default ({ selected, onChange }: { selected: string, onChange: (val?: number) => void }) => {
    const [val, setVal] = useState(selected);

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setVal(e.target.value);
        
        if(e.target.value !== "") {
            onChange(parseInt(e.target.value, 10));
        } else {
            onChange();
        }
    }

    return (
        <form>
            <label>
                <input
                    type="radio"
                    value="7"
                    checked={val === "7"}
                    onChange={handleChange}
                />
                Week
            </label>
            <label>
                <input
                    type="radio"
                    value="30"
                    checked={val === "30"}
                    onChange={handleChange}
                />
                30 days
            </label>
            <label>
                <input
                    type="radio"
                    value="90"
                    checked={val === "90"}
                    onChange={handleChange}
                />
                90 days
            </label>
            <label>
                <input
                    type="radio"
                    value="365"
                    checked={val === "365"}
                    onChange={handleChange}
                />
                Year
            </label>
            <label>
                <input
                    type="radio"
                    value=""
                    checked={val === ""}
                    onChange={handleChange}
                />
                All
            </label>

        </form>);
}
