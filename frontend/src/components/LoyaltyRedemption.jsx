import {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  AlertCircle,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Check,
  Clock,
  Coins,
  Copy,
  ExternalLink,
  Gift,
  History,
  Loader2,
  LucideShoppingCart,
  Monitor,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  X
} from 'lucide-react';
import loyaltyApi from '../services/loyaltyApi';
import api from "@/services/api.js";

// ─── Barcode component (uses JsBarcode — install: npm install jsbarcode) ──
const BarcodeDisplay = ({ value, format = 'CODE128' }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && value) {
      import('jsbarcode').then((JsBarcode) => {
        const fn = JsBarcode.default || JsBarcode;
        fn(svgRef.current, value, {
          format,
          width: 2,
          height: 80,
          displayValue: true,
          fontSize: 14,
          margin: 10,
          background: '#ffffff',
          lineColor: '#1a1a1a',
        });
      }).catch(console.error);
    }
  }, [value, format]);

  return (
    <div className="flex justify-center p-4 bg-white rounded-lg border">
      <svg ref={svgRef} />
    </div>
  );
};

// ─── Countdown timer hook ─────────────────────────────────────
function useCountdown(expiresAt) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!expiresAt) return;

    const update = () => {
      const now = Date.now();
      const exp = new Date(expiresAt).getTime();
      const diff = exp - now;

      if (diff <= 0) {
        setTimeLeft('Verlopen');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}u ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return timeLeft;
}

// ─── Single Redemption Card ───────────────────────────────────
const RedemptionCard = ({ redemption, onCancel, cancelling }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const countdown = useCountdown(redemption.expires_at);
  const isPending = redemption.status === 'PENDING';
  const isOnline = redemption.external_connection_type === 'SHOPIFY';

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColors = {
    PENDING: 'bg-amber-100 text-amber-800',
    REDEEMED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-gray-100 text-gray-600',
    EXPIRED: 'bg-red-100 text-red-700',
  };

  const statusLabels = {
    PENDING: t('loyalty.store.pending', 'In afwachting'),
    REDEEMED: t('loyalty.store.completed', 'Voltooid'),
    CANCELLED: t('loyalty.store.cancelled', 'Geannuleerd'),
    EXPIRED: t('loyalty.store.expired', 'Verlopen'),
  };

  return (
    <div className="p-4 border rounded-lg bg-white space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">{redemption.product_name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[redemption.status] || 'bg-gray-100'}`}>
              {statusLabels[redemption.status] || redemption.status}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
              {isOnline ? <Monitor className="w-3 h-3" /> : <Store className="w-3 h-3" />}
              {isOnline ? 'Online' : t('loyalty.store.inStore', 'In winkel')}
            </span>
          </div>
        </div>
        <span className="text-sm font-semibold text-[oklch(0.35_0.12_15)]">
          {(redemption.points_spent+redemption.bonus_points_spent)?.toLocaleString('nl-NL')} pts
        </span>
      </div>

      {/* Promo code or barcode */}
      {isPending && redemption.code && (
        <div className="space-y-2">
          {isOnline ? (
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-gray-50 border rounded font-mono text-sm tracking-wider text-center">
                {redemption.code}
              </code>
              <button
                onClick={() => copyCode(redemption.code)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={t('loyalty.store.copy', 'Kopiëren')}
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <BarcodeDisplay
                value={redemption.ean13Barcode || redemption.code}
                format={redemption.ean13Barcode ? 'EAN13' : 'CODE128'}
              />
            </div>
          )}

          {/* Expiration countdown */}
          {redemption.expires_at && (
            <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
              <Clock className="w-3 h-3" />
              {t('loyalty.store.expiresIn', 'Verloopt over')}: {countdown}
            </div>
          )}

          {/* Shopify link for online */}
          {isOnline && redemption.product_url && (
            <a
              href={redemption.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              {t('loyalty.store.shopOnShopify', 'Bestellen op Shopify')}
            </a>
          )}

          {/* Cancel button */}
          <button
            onClick={() => onCancel(redemption.id)}
            disabled={cancelling}
            className="w-full mt-1 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {cancelling ? (
              <span className="flex items-center justify-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                {t('loyalty.store.cancelling', 'Annuleren...')}
              </span>
            ) : (
              t('loyalty.store.cancelRedemption', 'Annuleer & punten terugkrijgen')
            )}
          </button>
        </div>
      )}

      {/* Date */}
      <p className="text-xs text-gray-500">
        {new Date(redemption.created_at).toLocaleDateString('nl-NL', {
          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })}
      </p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

/**
 * LoyaltyRedemption — Drop-in component for the Loyalty tab.
 *
 * Props:
 *   customerData   — the existing customer profile object (for name, etc.)
 *   onPointsChange — optional callback when points balance changes (to refresh parent)
 *
 * Usage in App.jsx:
 *   import LoyaltyRedemption from './components/LoyaltyRedemption';
 *
 *   <LoyaltyRedemption
 *     customerData={customerData}
 *   />
 */
const LoyaltyRedemption = ({ customerData }) => {
  const { t } = useTranslation();

  // State
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [products, setProducts] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAffordableOnly, setShowAffordableOnly] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc'); // asc | desc — sort products by points
  const [activeView, setActiveView] = useState('products'); // products | redemptions | history

  // Redemption dialog state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogStep, setDialogStep] = useState('choice'); // choice | processing | success
  const [redeeming, setRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  // ─── Data loading ─────────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [enrollments] = await Promise.all([
        loyaltyApi.getEnrollments(),
      ]);

      const enrollment = enrollments[0]

      const [productsData, redemptionsData, transactionsData] = await Promise.all([
          await loyaltyApi.getProducts(enrollment.program_id),
          await loyaltyApi.getRedemptions(enrollment.id),
          await loyaltyApi.getTransactions(enrollment.id),
      ])

      setEnrollmentData(enrollment);
      setProducts(productsData || []);
      setRedemptions(redemptionsData || []);
      setTransactions(transactionsData || []);
    } catch (err) {
      console.error('Failed to load loyalty store data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Filtering ────────────────────────────────────────────────
  const categories = Array.from(new Set(products.flatMap(p => p.categories).filter(Boolean)));

  const availablePoints = (enrollmentData?.points + enrollmentData?.bonus_points) ?? 0
  const reservedPoints = enrollmentData?.reserved_points ?? 0;
  const totalPoints = (availablePoints + reservedPoints) ?? 0;

  const filteredProducts = products
    .filter(p => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategory !== 'all' && !p.categories.includes(selectedCategory)) return false;
      if (showAffordableOnly && p.points > availablePoints) return false;
      return true;
    })
    .sort((a, b) => sortOrder === 'asc'
      ? (a.points ?? 0) - (b.points ?? 0)
      : (b.points ?? 0) - (a.points ?? 0));

  const pendingRedemptions = redemptions.filter(r => r.status === 'PENDING');

  // ─── Redeem flow ──────────────────────────────────────────────
  const openRedeemDialog = async (product) => {
    setSelectedProduct(product);
    setDialogStep('choice');
    setRedeemResult(null);
  };

  const closeDialog = () => {
    setSelectedProduct(null);
    setDialogStep('choice');
    setRedeemResult(null);
  };

  const handleRedeem = async (channelId) => {
    if (!selectedProduct) return;
    setDialogStep('processing');
    setRedeeming(true);

    try {
      const result = await loyaltyApi.redeemProduct(enrollmentData.id, selectedProduct.id, channelId);
      setRedeemResult(result);
      setDialogStep('success');
      await loadData();
    } catch (err) {
      setError(err.message);
      closeDialog();
    } finally {
      setRedeeming(false);
    }
  };

  const handleCancel = async (redemptionId) => {
    setCancellingId(redemptionId);
    try {
      await loyaltyApi.cancelRedemption(redemptionId);
      await loadData();
      onPointsChange?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  // ─── Loading state ────────────────────────────────────────────
  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[oklch(0.35_0.12_15)]" />
          <span className="ml-2 text-gray-600">{t('loyalty.store.loading', 'Bezig met laden...')}</span>
        </CardContent>
        <RedeemDialog
          selectedProduct={selectedProduct}
          redeemResult={redeemResult}
          handleRedeem={handleRedeem}
          dialogStep={dialogStep}
          t={t}
          closeDialog={closeDialog}
        />
      </Card>
    );
  }

  // ─── Error state ──────────────────────────────────────────────
  if (error && !products.length) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-gray-600">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-[oklch(0.35_0.12_15)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            {t('loyalty.store.retry', 'Opnieuw proberen')}
          </button>
        </CardContent>
          <RedeemDialog
              selectedProduct={selectedProduct}
              redeemResult={redeemResult}
              handleRedeem={handleRedeem}
              dialogStep={dialogStep}
              t={t}
              closeDialog={closeDialog}
          />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Points Overview Card ──────────────────────────────── */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Gift className="w-6 h-6 text-[oklch(0.35_0.12_15)]" />
            {t('loyalty.store.title', 'Punten Winkel')}
          </CardTitle>
          <CardDescription>
            {t('loyalty.store.description', 'Wissel je punten in voor exclusieve producten en kortingen')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <p className="text-sm text-purple-700">{t('loyalty.store.available', 'Beschikbaar')}</p>
              <p className="text-2xl font-bold text-purple-900">
                {availablePoints.toLocaleString('nl-NL')}
              </p>
              {reservedPoints > 0 && (
                <p className="text-xs text-purple-600 mt-1">
                  {reservedPoints.toLocaleString('nl-NL')} {t('loyalty.store.reservedShort', 'gereserveerd')}
                </p>
              )}
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg">
              <p className="text-sm text-amber-700">{t('loyalty.store.pendingCount', 'Openstaand')}</p>
              <p className="text-2xl font-bold text-amber-900">{pendingRedemptions.length}</p>
              <p className="text-xs text-amber-600 mt-1">{t('loyalty.store.awaitingCompletion', 'In afwachting')}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <p className="text-sm text-green-700">{t('loyalty.store.total', 'Totaal')}</p>
              <p className="text-2xl font-bold text-green-900">
                {totalPoints.toLocaleString('nl-NL')}
              </p>
              <p className="text-xs text-green-600 mt-1">{t('loyalty.store.allPoints', 'Alle punten')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Pending Redemptions ───────────────────────────────── */}
      {pendingRedemptions.length > 0 && (
        <Card className="border-0 shadow-lg border-l-4 border-l-amber-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              {t('loyalty.store.pendingRedemptions', 'Openstaande inwisselingen')}
              <span className="text-sm font-normal text-gray-500">({pendingRedemptions.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingRedemptions.map(r => (
              <RedemptionCard
                key={r.id}
                redemption={r}
                onCancel={handleCancel}
                cancelling={cancellingId === r.id}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* ─── View Tabs ─────────────────────────────────────────── */}
      <div className="flex gap-2 border-b pb-2">
        {[
          { key: 'products', icon: ShoppingBag, label: t('loyalty.store.products', 'Producten') },
          { key: 'redemptions', icon: Tag, label: t('loyalty.store.myRedemptions', 'Mijn inwisselingen') },
          { key: 'history', icon: History, label: t('loyalty.store.history', 'Geschiedenis') },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              activeView === tab.key
                ? 'bg-[oklch(0.35_0.12_15)] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Products View ─────────────────────────────────────── */}
      {activeView === 'products' && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 space-y-4">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
              <div className="relative w-full sm:w-1/2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t('loyalty.store.searchProducts', 'Zoek producten...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-[25%] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(0.35_0.12_15)] focus:border-transparent"
              >
                <option value="all">{t('loyalty.store.allCategories', 'Alle categorieën')}</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                title={sortOrder === 'asc'
                  ? t('loyalty.store.sortAsc', 'Punten: laag naar hoog')
                  : t('loyalty.store.sortDesc', 'Punten: hoog naar laag')}
                className="flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[oklch(0.35_0.12_15)] focus:border-transparent transition-colors"
              >
                {sortOrder === 'asc'
                  ? <ArrowUpNarrowWide className="w-4 h-4 text-[oklch(0.35_0.12_15)]" />
                  : <ArrowDownWideNarrow className="w-4 h-4 text-[oklch(0.35_0.12_15)]" />}
                {t('loyalty.store.sortByPoints', 'Punten')}
              </button>
              <label className="flex items-center gap-2 text-sm whitespace-nowrap cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAffordableOnly}
                  onChange={(e) => setShowAffordableOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[oklch(0.35_0.12_15)] focus:ring-[oklch(0.35_0.12_15)]"
                />
                {t('loyalty.store.affordableOnly', 'Alleen betaalbaar')}
              </label>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>{t('loyalty.store.noProducts', 'Geen producten gevonden')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => {
                  const canAfford = availablePoints >= product.points;
                  return (
                    <div
                      key={product.id}
                      className={`border rounded-xl overflow-hidden transition-all hover:shadow-md ${
                        canAfford ? 'bg-white' : 'bg-gray-50 opacity-70'
                      }`}
                    >
                      <div className="h-40 bg-gray-100 overflow-hidden">
                        <img
                          src={product.image_url ?? '/no-photo.png'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
                          {product?.categories.slice(0, 2).map(category =>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                {category}
                              </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          <div dangerouslySetInnerHTML={{ __html: product.description }} />
                        </p>
                        {/* Shopify badge */}
                        {product.channel_links && (
                            product.channel_links
                                .filter(channel_link => channel_link.external_connection_type === 'SHOPIFY')
                                .map(channel_link =>
                                    <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                      <a
                                          href={channel_link.product_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        {channel_link.channel_name}
                                      </a>
                                    </span>
                                )
                        )}
                        <div className="flex items-center justify-between pt-2">
                          <span className="font-bold text-[oklch(0.35_0.12_15)]">
                            <Coins className="w-4 h-4 inline mr-1" />
                            {product.points?.toLocaleString('nl-NL')} pts
                          </span>
                          <button
                            onClick={() => openRedeemDialog(product)}
                            disabled={!canAfford}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              canAfford
                                ? 'bg-[oklch(0.35_0.12_15)] text-white hover:opacity-90'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {canAfford
                              ? t('loyalty.store.redeem', 'Inwisselen')
                              : t('loyalty.store.notEnoughPoints', 'Te weinig punten')}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ─── Redemptions View ──────────────────────────────────── */}
      {activeView === 'redemptions' && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 space-y-3">
            {redemptions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>{t('loyalty.store.noRedemptions', 'Nog geen inwisselingen')}</p>
              </div>
            ) : (
              redemptions.map(r => (
                <RedemptionCard
                  key={r.id}
                  redemption={r}
                  onCancel={handleCancel}
                  cancelling={cancellingId === r.id}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* ─── Transaction History View ──────────────────────────── */}
      {activeView === 'history' && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>{t('loyalty.store.noTransactions', 'Nog geen transacties')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx, i) => {
                  const isPositive = tx.type === 'EARN' || tx.type === 'REFUND' || tx.type === 'CREDIT' || tx.type === 'EXPIRED';
                  return (
                    <div key={tx.id || i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                          {isPositive
                            ? <Sparkles className="w-4 h-4 text-green-600" />
                            : <ShoppingBag className="w-4 h-4 text-red-600" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(tx.created_at).toLocaleDateString('nl-NL', {
                              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : '-'}{Math.abs(tx.points).toLocaleString('nl-NL')} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ─── Redemption Dialog (Modal Overlay) ─────────────────── */}
        <RedeemDialog
            selectedProduct={selectedProduct}
            redeemResult={redeemResult}
            handleRedeem={handleRedeem}
            dialogStep={dialogStep}
            t={t}
            closeDialog={closeDialog}
        />
    </div>
  );
};


function RedeemDialog({selectedProduct, handleRedeem, dialogStep, closeDialog, redeemResult, t}) {
    const [copied, setCopied] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const copyCode = async (code) => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    function onCloseDialog() {
        setCopied(false);
        closeDialog();
    }

    async function onAddToCart() {
      setIsAddingToCart(true);
      try {
        const cart = await api.createCart(redeemResult.external_connection_id, {
          items: [
            {
              product_variant_id: selectedProduct.product_variant_id,
              quantity: 1
            }
          ],
          discount_codes: [redeemResult.code]
        });
        window.open(cart.checkout_url, '_blank');
      } catch (error) {
        console.error("Failed to add to cart", error);
      } finally {
        setIsAddingToCart(false);
      }
    }

    if (!selectedProduct) {
        return undefined;
    }

    const showAddToCartButton = redeemResult?.external_connection_type === 'SHOPIFY'

    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={dialogStep !== 'success' ? onCloseDialog : undefined}>
        <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
          {/* Dialog Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-lg text-gray-900">
              {dialogStep === 'choice' && t('loyalty.store.howToRedeem', 'Hoe wil je inwisselen?')}
              {dialogStep === 'processing' && t('loyalty.store.processing', 'Bezig met verwerken...')}
              {dialogStep === 'success' && t('loyalty.store.redeemSuccess', 'Inwisseling gelukt!')}
            </h3>
            <button onClick={closeDialog} className="p-1 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Product info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {selectedProduct.image_url && (
                  <img src={selectedProduct.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <p className="font-semibold text-sm">{selectedProduct.name}</p>
                <p className="text-sm text-[oklch(0.35_0.12_15)] font-bold">
                  {selectedProduct.points?.toLocaleString('nl-NL')} {t('loyalty.store.points', 'punten')}
                </p>
              </div>
            </div>

            {/* Step: Choice — Online or In-Store */}
            {dialogStep === 'choice' && (
                <div className={selectedProduct.channel_links.length < 2 ? 'flex flex-wrap justify-center gap-3' : "grid grid-cols-2 gap-3"}>
                  {selectedProduct.channel_links.map((channel, i) => (
                      <button
                          onClick={() => handleRedeem(channel.channel_id)}
                          className="flex flex-col items-center gap-3 p-6 border-2 rounded-xl hover:border-[oklch(0.35_0.12_15)] hover:bg-gray-50 transition-all group"
                      >
                        {channel.external_connection_type === 'SHOPIFY' && <Monitor
                            className="w-10 h-10 text-gray-400 group-hover:text-[oklch(0.35_0.12_15)] transition-colors"/>
                        }
                        {channel.external_connection_type === 'DIGI' && <Store className="w-10 h-10 text-gray-400 group-hover:text-[oklch(0.35_0.12_15)] transition-colors" />
                        }

                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{channel.channel_name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {channel.channel_description}
                          </p>
                        </div>
                      </button>
                  ))}
                </div>
            )}

            {/* Step: Processing */}
            {dialogStep === 'processing' && (
                <div className="flex flex-col items-center py-8 space-y-3">
                  <Loader2 className="w-10 h-10 animate-spin text-[oklch(0.35_0.12_15)]" />
                  <p className="text-gray-600">{t('loyalty.store.generatingCode', 'Code wordt aangemaakt...')}</p>
                </div>
            )}

            {/* Step: Success */}
            {dialogStep === 'success' && redeemResult && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 rounded-lg">
                    <Check className="w-5 h-5" />
                    <p className="text-sm font-medium">
                      {(redeemResult.points_spent+redeemResult.bonus_points_spent)?.toLocaleString('nl-NL')} {t('loyalty.store.pointsReserved', 'punten gereserveerd')}
                    </p>
                  </div>

                  {redeemResult.external_connection_type === 'SHOPIFY' ? (
                      <>
                        <div>
                          <Label className="text-sm font-medium text-gray-600 mb-1 block">
                            {t('loyalty.store.discountCode', 'Kortingscode')}
                          </Label>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 px-4 py-3 bg-gray-50 border rounded-lg font-mono text-lg tracking-widest text-center font-bold">
                              {redeemResult.code}
                            </code>
                            <button
                                onClick={() => copyCode(redeemResult.code)}
                                className="p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                            >
                              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-500" />}
                            </button>
                          </div>
                        </div>
                        {redeemResult.product_url && (
                            <a
                                href={redeemResult.product_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[oklch(0.35_0.12_15)] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                              <ExternalLink className="w-4 h-4" />
                              {t('loyalty.store.shopNow', 'Nu bestellen op Shopify')}
                            </a>
                        )}
                      </>
                  ) : (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600 mb-1 block">
                          {t('loyalty.store.showBarcode', 'Toon deze barcode aan de kassa')}
                        </Label>
                        <BarcodeDisplay
                            value={redeemResult.code}
                            format={redeemResult.code ? 'EAN13' : 'CODE128'}
                        />
                      </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                    <Clock className="w-3.5 h-3.5" />
                    {t('loyalty.store.expiryNotice', 'Deze code verloopt over 48 uur. Punten worden pas definitief afgeschreven na voltooiing van de bestelling.')}
                  </div>

                    <div className="flex flex-col gap-2">
                        {/* Only show Add to Cart if the selected channel is SHOPIFY */}
                      {showAddToCartButton && (
                          <button
                              onClick={onAddToCart}
                              disabled={isAddingToCart}
                              className="w-full px-4 py-3 bg-[oklch(0.35_0.12_15)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isAddingToCart ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  {t('loyalty.store.adding', 'Toevoegen...')}
                                </>
                            ) : (
                                <>
                                  <LucideShoppingCart className="w-5 h-5" />
                                  {t('loyalty.store.addToCart', 'In winkelwagen')}
                                </>
                            )}
                          </button>
                      )}

                        <button
                            onClick={onCloseDialog}
                            className={`w-full px-4 py-3 rounded-xl font-semibold transition-all ${
                                showAddToCartButton
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-[oklch(0.35_0.12_15)] text-white hover:opacity-90'
                            }`}
                        >
                            {t('loyalty.store.close', 'Sluiten')}
                        </button>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
}

export default LoyaltyRedemption;
