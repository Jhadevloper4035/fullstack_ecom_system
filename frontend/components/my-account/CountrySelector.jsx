import React, { memo } from "react";

const CountrySelect = memo(function CountrySelect() {
  return (
    <div className="tf-select">
      <select
        className="text-title"
        id="country"
        name="address[country]"
        defaultValue=""
      >
        <option value="" disabled>
          Select country
        </option>

        {COUNTRIES.map((country) => (
          <option
            key={country.name}
            value={country.name}
            data-provinces={JSON.stringify(country.provinces)}
          >
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
});

export default CountrySelect;
