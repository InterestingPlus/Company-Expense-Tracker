import Tree from "react-d3-tree";

const myTreeData = [
  {
    name: "Total Budget ₹100000",
    children: [
      {
        name: "Food ₹25000",
        children: [{ name: "Groceries ₹15000" }, { name: "Dining ₹10000" }],
      },
      {
        name: "Transport ₹15000",
        children: [{ name: "Fuel ₹8000" }, { name: "Public ₹7000" }],
      },
      {
        name: "Rent ₹30000",
      },
    ],
  },
];

const TreeBudget = () => {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Tree data={myTreeData} orientation="vertical" />
    </div>
  );
};

export default TreeBudget;
