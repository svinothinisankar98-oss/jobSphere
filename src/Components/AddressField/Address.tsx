import React from "react";
import CommonTextField from "../ui/CommonTextField";
import CommonDropdown from "../ui/CommonDropdown";

type Props = {
  value: {
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
};

const COUNTRY_OPTIONS = [
  { id: 1, item: "India" },
  { id: 2, item: "United States" },
  { id: 3, item: "United Kingdom" },
  { id: 4, item: "Canada" },
];

const Address: React.FC<Props> = ({ value, onChange }) => {
  return (
    <>
      {/* Address Line */}
      <CommonTextField
        label="Address"
        name="address"
        value={value.address}
        placeholder="Enter address"
        required
        onChange={onChange}
      />

      <div className="row g-3">
        <div className="col-md-3">
          <CommonTextField
            label="City"
            name="city"
            value={value.city}
            placeholder="City"
            required
            onChange={onChange}
          />
        </div>

        <div className="col-md-3">
          <CommonTextField
            label="State"
            name="state"
            value={value.state}
            placeholder="State"
            required
            onChange={onChange}
          />
        </div>

        <div className="col-md-3">
          <CommonDropdown
            label="Country"
            name="country"
            value={value.country}
            options={COUNTRY_OPTIONS}
            placeholder="Select Country"
            onChange={onChange}
          />
        </div>

        <div className="col-md-3">
          <CommonTextField
            label="ZIP / PIN"
            name="zip"
            inputMode="numeric"
            value={value.zip}
            placeholder="ZIP / PIN"
            required
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
};

export default Address;
