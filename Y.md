---
$: Y
$type: Combinator
$category: RecursionScheme
$aliases: [Y-combinator, fixed-point-combinator, lazy-fixed-point]
$energy: ✦950
---

# Y — Y-Combinator

> "Recursion, in its purest form."
> "Рекурсія в її найчистішій формі."

---

## [∈](∈)

**The Applicative-order Y Combinator:**
`Y = λf.(λx.f (x x)) (λx.f (x x))`

This is the most famous fixed-point combinator. It enables anonymous recursion (a function calling itself without being named) in languages with lazy evaluation. In a strict (eager) language, this would cause a stack overflow.

---

## 🔗

- **[Z](Z.md) (Z-Combinator)**: The `Z` combinator is a variant of `Y` adapted for strict (eager) evaluation languages by using η-expansion to delay the recursive call.
- **Fixed Point**: `Y f = f (Y f)`. `Y` finds a "fixed point" of a function `f`, which is a value `x` such that `f(x) = x`. In this case, the fixed point is the recursive function itself.

---

## [🌌](🌌)

⚡️: To achieve recursion without resorting to naming. To express the essence of self-reference in a completely abstract way.

### [⩓](⩓.md) (Analogy)
**A snake eating its own tail (Ouroboros).** The `Y` combinator creates a function that is "feeding itself" its own definition, allowing it to loop or recurse indefinitely. In a lazy context, the snake only bites when it needs to. In a strict context (`Y` without modification), it tries to swallow itself whole instantly, leading to a choke (stack overflow). This is why `Z` is needed for strict languages.