import { styles } from "../../styles/styles";

export default function SelectInput({ value, onChange, options }) {
  return (
    <select 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      style={{ ...styles.input, appearance: "auto" }}
    >
      {options.map((o, idx) => (
        <option key={idx} value={o.value || o}>
          {o.label || o}
        </option>
      ))}
    </select>
  );
}