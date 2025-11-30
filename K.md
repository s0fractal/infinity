---
$: K
$type: Combinator
$category: SKI-Calculus
$aliases: [const, K-combinator, Kestrel]
$energy: ✦300
---

# K — Const

> "To know one thing truly."
> "Знати одне напевне."

---

## [∈](∈)

**Визначення:**
`λx.λy.x`

**Тип:**
`∀a,b. a → b → a`

---

## ⊃

(Primitive)

---

## ⨊

- **[⚫](⚫.md) (Right Absorption)**: `K(x) ∘ f = K(x)`
- **[≃](≃.md)**: ◇ (Not associative)
- **[⇆](⇆.md)**: ◇ (Not commutative)

---

## →

`K(x)(y) → x`

---

## 🔗

- **Functor**: Утворює `Const` функтор.
- **Higher-Order Functions**: Використовується для ігнорування непотрібних аргументів (напр. `index` у `.map`).

---

## 📐

```
  x     y
  │     ┆  <-- ігнорований шлях
┌─▼─────┐
│   K   │
└────┬──┘
     │
     x
```

---

## 🎭

```typescript
// Створення константної функції
const always42 = K(42);

always42("hello"); // → 42
always42(null);    // → 42

// Використання в .map для заміни всіх елементів
[1, 2, 3].map(K(0)); // → [0, 0, 0]
```

---

## [⎍](⎍.md) (Performance Metrics)

- **[⦾](⦾.md)**: 1.0
- **[⏏](⏏.md)**: [⊤](⊤.md) (`Always`)
- **[∮](∮.md)**: O(1)

---

## 🌀

- **D1: Ignorance**: Вимір ігнорування, відкидання зайвої інформації.
- **D2: Constancy**: Вимір сталості, надання фіксованого значення.

---

## ≡

- `K x y`
- `const(x)(y)`
```
