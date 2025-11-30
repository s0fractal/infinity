import { assertEquals } from "@std/assert";
import { add } from "./main.ts";

Deno.test(function addTest() {
  assertEquals(add(2, 3), 5);
});
import { O } from "./⭘.ts";
Deno.test(()=> {
  assertEquals(O["𝟏"]); 
}
)