import React, { Suspense } from "react";
import ErrorBoundary  from "./components/ErrorBoundary";

/* const Products = React.lazy(() => 
  import("products/Products").catch((error) => 
    ({ default: () => <div>Erro ao carregar o micro-frontend: {error.message}</div> }))
); */

const Products = React.lazy(() => 
  import("products/Products").catch(() => {
    throw new Error(`Falha ao carregar o módulo Products`);
  })
);

export default function App() {
  return (
    <div>
      <h1>Ecommerce</h1>
      <ErrorBoundary componentName="Products">
        <Suspense fallback={<div>Loading Products...</div>} >
          <Products />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}