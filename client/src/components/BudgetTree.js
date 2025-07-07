import "./BudgetTree.scss";

const BudgetTree = ({ totalBudget, categories }) => {
  return (
    <>
      <h2>🌳 Monthly Budget Tree</h2>
      <ul className="tree-root">
        <li className="tree-node root">
          💰 Total Budget: ₹{totalBudget.toLocaleString()}
          <ul>
            {categories.map((cat, i) => (
              <li className="tree-node parent" key={i}>
                📁 {cat.name} — ₹{cat.amount.toLocaleString()}
                {cat.subcategories?.length > 0 && (
                  <ul>
                    {cat.subcategories.map((sub, j) => (
                      <li className="tree-node child" key={j}>
                        🔹 {sub.name} — ₹{sub.amount.toLocaleString()}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </>
  );
};

export default BudgetTree;
