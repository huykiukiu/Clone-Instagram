import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectGenderForm({ value }) {
  return (
    <Select value={value}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Chọn giới tính" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="male">Nam</SelectItem>
          <SelectItem value="female">Nữ</SelectItem>
          <SelectItem value="other">Khác</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
