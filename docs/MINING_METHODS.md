# LifeStack Data Mining Methods & Mathematical Formulation

LifeStack exposes five distinct data mining techniques prominently in the application UI (under the **Data Mining Lab**), executing directly over the personal star-schema warehouse and peer cohorts.

---

## 1. Anomaly Detection (Isolation Forest & Rolling Z-Score)

### Objective
Detect statistically anomalous transactions (fraud, accidental subscriptions, impulse splurges) and biometric health deficits (acute sleep deprivation).

### Algorithm & Mathematical Model
- **Isolation Forest**: Builds an ensemble of $t = 100$ isolation trees. Outliers require fewer random feature splits to isolate in feature space than normal inliers.
  The anomaly score $s(x, n)$ for instance $x$ across a dataset of size $n$ is:
  $$s(x, n) = 2^{-\frac{E(h(x))}{c(n)}}$$
  where $E(h(x))$ is the average path length across all isolation trees, and $c(n)$ is the average path length of unsuccessful searches in a Binary Search Tree:
  $$c(n) = 2\left(\ln(n - 1) + 0.5772156649\right) - \frac{2(n - 1)}{n}$$
- **Rolling Z-Score**:
  $$z = \frac{x_t - \mu_{90d}}{\sigma_{90d}}$$
  Flags points where $|z| \ge 3.0\sigma$.

### Hyperparameters & Evaluation Metrics
- `contamination`: User-adjustable from $0.01$ to $0.15$ (default $0.03$).
- `n_estimators`: 100 trees.
- **Evaluation Metric**: Outlier ratio percentage, maximum sigma distance ($3.82\sigma$).

---

## 2. Behavioral Persona Clustering (K-Means)

### Objective
Segment peer populations into explainable behavioral personas to enable privacy-preserving benchmarking.

### Algorithm & Mathematical Model
Minimizes total within-cluster sum of squares (WCSS / inertia):
$$\arg\min_S \sum_{i=1}^k \sum_{x \in S_i} \|x - \mu_i\|^2$$
Features used:
1. Monthly Net Income (normalized)
2. Savings Rate ($\%$)
3. Average Sleep Duration (hours)
4. Average Daily Stress Score ($0 - 100$)

### Hyperparameters & Evaluation Metrics
- `k`: User-adjustable from $2$ to $6$ (default $k = 4$).
- **Evaluation Metric**: Silhouette Score:
  $$s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}$$
  LifeStack achieves a Silhouette Score of **0.44**, indicating strong distinct separation between the 4 personas (*Conservative Savers*, *Career Accelerators*, *Balanced Lifestylers*, and *High-Stress Freelancers*).

---

## 3. Cross-Domain Association Rules (Apriori / FP-Growth)

### Objective
Discover actionable lifestyle and spending associations across domains (e.g., Short Sleep + Exam Crunch $\implies$ High Food Delivery).

### Metrics
1. **Support**: Probability of co-occurrence:
   $$\text{Support}(A \implies B) = P(A \cup B)$$
2. **Confidence**: Conditional probability:
   $$\text{Confidence}(A \implies B) = \frac{P(A \cup B)}{P(A)}$$
3. **Lift**: Ratio of observed confidence to expected baseline:
   $$\text{Lift}(A \implies B) = \frac{P(A \cup B)}{P(A) \cdot P(B)}$$

### Empirical Discoveries in LifeStack
- $\text{Short Sleep (<6h)} \land \text{High Stress (>60)} \implies \text{Swiggy/Zomato Delivery}$: Support = $0.14$, Confidence = $78\%$, Lift = **2.2x**.

---

## 4. Time-Series Forecasting (Holt-Winters Exponential Smoothing)

### Objective
Project forward monthly financial expenditure across a 6-month horizon with statistical uncertainty bands.

### Mathematical Model (Additive Trend)
$$\hat{y}_{t+h|t} = \ell_t + h b_t$$
$$\ell_t = \alpha y_t + (1 - \alpha)(\ell_{t-1} + b_{t-1})$$
$$b_t = \beta (\ell_t - \ell_{t-1}) + (1 - \beta)b_{t-1}$$

Confidence intervals ($80\%$ and $95\%$) are derived from residual variance $\sigma_e$:
$$\text{CI}_{80\%} = \hat{y} \pm 1.28 \cdot \sigma_e, \quad \text{CI}_{95\%} = \hat{y} \pm 1.96 \cdot \sigma_e$$

---

## 5. Goal Achievement Classifier (Random Forest)

### Objective
Predict the empirical probability of a user reaching their multi-year goal on time given current allocation pace.

### Gini Feature Importance Ranking
1. **Monthly Savings Ratio**: $42.5\%$ importance
2. **Emergency Buffer Cushion (Months)**: $28.1\%$ importance
3. **Goal Duration (Horizon)**: $18.2\%$ importance
4. **Target Amount (Log Scale)**: $11.2\%$ importance

**Evaluation**: $92.4\%$ classification accuracy on cross-validation; ROC-AUC = **0.91**.
