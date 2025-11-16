
import React, { useMemo } from 'react';
import { useDatabase } from '../../services/database';
import { Position, Employee, Unit } from '../../types';
import Card from '../../components/ui/Card';

// Define the shape of a tree node
interface TreeNode extends Position {
  children: TreeNode[];
  employee?: Employee;
  unit?: Unit;
}

// A recursive component to render each node and its children
const OrgChartNode: React.FC<{ node: TreeNode }> = ({ node }) => {
  const nodeCard = (
    <div className="inline-block bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center min-w-[220px] mx-auto">
      <p className="font-bold text-brand-blue-700 text-md">{node.name}</p>
      <p className="text-gray-600">{node.employee ? node.employee.name : <span className="text-red-500 italic text-sm">Jabatan Kosong</span>}</p>
      {node.unit && <p className="text-xs text-gray-400 mt-1 bg-gray-100 rounded-full px-2 py-1 inline-block">{node.unit.name}</p>}
    </div>
  );

  return (
    <li className="flex flex-col items-center justify-start relative px-4 py-8">
      {nodeCard}
      {node.children && node.children.length > 0 && (
        <ul className="flex justify-center pt-8">
          {node.children.map(child => (
            <OrgChartNode key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

const StrukturOrganisasi: React.FC = () => {
    const { db } = useDatabase();

    const orgTree = useMemo(() => {
        const { positions, employees, units } = db;

        const positionMap = new Map<string, TreeNode>();
        positions.forEach(pos => {
            const employee = employees.find(e => e.positionId === pos.id);
            const unit = units.find(u => u.id === pos.unitId);
            positionMap.set(pos.id, { ...pos, children: [], employee, unit });
        });

        const roots: TreeNode[] = [];
        positionMap.forEach(node => {
            if (node.parentPositionId && positionMap.has(node.parentPositionId)) {
                const parent = positionMap.get(node.parentPositionId);
                if (parent) {
                   parent.children.push(node);
                }
            } else {
                roots.push(node);
            }
        });
        
        // Sort children by some criteria if needed, e.g., level or name
        positionMap.forEach(node => {
           node.children.sort((a, b) => a.name.localeCompare(b.name));
        });

        return roots;
    }, [db.positions, db.employees, db.units]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Struktur Organisasi</h1>
            <Card className="p-4 md:p-8 overflow-x-auto bg-gray-50">
              <div className="org-chart">
                {orgTree.length > 0 ? (
                  <ul className="flex justify-center">
                      {orgTree.map(rootNode => (
                         <OrgChartNode key={rootNode.id} node={rootNode} />
                      ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500 py-10">Struktur organisasi belum tersedia atau tidak ada jabatan root.</p>
                )}
              </div>
               <style>{`
                  .org-chart, .org-chart ul, .org-chart li {
                    position: relative;
                  }
                  .org-chart ul {
                    display: flex;
                  }
                  .org-chart li {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                  }
                  /* Vertical line from parent to horizontal connector */
                  .org-chart li::before {
                    content: '';
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 2px;
                    height: 2rem; /* space between node and horizontal line */
                    background-color: #d1d5db;
                  }
                   /* Horizontal connector line */
                  .org-chart li::after {
                    content: '';
                    position: absolute;
                    bottom: calc(100% - 2px);
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: #d1d5db;
                  }
                  /* Hide lines for the root element */
                  .org-chart > ul > li::before,
                  .org-chart > ul > li::after {
                    display: none;
                  }
                  /* Horizontal line should only connect siblings */
                  .org-chart li:only-child::after {
                     display: none;
                  }
                  /* Shorten the horizontal line for the first child */
                  .org-chart li:first-child::after {
                    left: 50%;
                    width: 50%;
                  }
                  /* Shorten the horizontal line for the last child */
                  .org-chart li:last-child::after {
                    width: 50%;
                  }
               `}</style>
            </Card>
        </div>
    );
};

export default StrukturOrganisasi;
