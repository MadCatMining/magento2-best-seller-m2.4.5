<?php
namespace Emizentech\Bestsellerwidget\Block\Widget;

use Magento\Framework\View\Element\Template;
use Magento\Widget\Block\BlockInterface;
use Magento\Catalog\Block\Product\Context;
use Magento\Sales\Model\ResourceModel\Report\Bestsellers\CollectionFactory as BestsellersCollectionFactory;
use Magento\Catalog\Model\ProductRepository;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Catalog\Api\Data\ProductInterface;
use Magento\Catalog\Model\Product\Visibility;

class Bestsellerdproduct extends Template implements BlockInterface
{
    protected $_template = 'Emizentech_Bestsellerwidget::widget/bestsellerdproduct.phtml';

    const DEFAULT_PRODUCTS_COUNT = 10;
    const DEFAULT_IMAGE_WIDTH = 150;
    const DEFAULT_IMAGE_HEIGHT = 150;
    const DEFAULT_PRODUCTS_PER_SLIDE = 4;
    const DEFAULT_AUTOPLAY_SPEED = 3000;
    const DEFAULT_PERIOD = 'monthly';

    protected $imageHelper;
    protected $cartHelper;
    protected $bestsellersCollectionFactory;
    protected $productRepository;
    protected $productVisibility;
    protected $storeManager;

    public function __construct(
        Context $context,
        BestsellersCollectionFactory $bestsellersCollectionFactory,
        ProductRepository $productRepository,
        Visibility $productVisibility,
        array $data = []
    ) {
        $this->imageHelper = $context->getImageHelper();
        $this->cartHelper = $context->getCartHelper();
        $this->bestsellersCollectionFactory = $bestsellersCollectionFactory;
        $this->productRepository = $productRepository;
        $this->productVisibility = $productVisibility;
        $this->storeManager = $context->getStoreManager();
        parent::__construct($context, $data);
    }

    public function imageHelperObj()
    {
        return $this->imageHelper;
    }

    public function getBestsellerProduct()
    {
        $limit = $this->getProductLimit();
        $period = $this->getPeriod();

        $collection = $this->bestsellersCollectionFactory->create();

        $dateRange = $this->getDateRangeByPeriod($period);
        if ($dateRange['from'] && $dateRange['to']) {
            $collection->addFieldToFilter('period', ['from' => $dateRange['from'], 'to' => $dateRange['to']]);
        }

        $collection->setPageSize($limit * 2);

        return $collection;
    }

    protected function getDateRangeByPeriod($period)
    {
        $timezone = new \DateTimeZone($this->_localeDate->getConfigTimezone());
        $to = new \DateTime('now', $timezone);
        $from = clone $to;

        switch ($period) {
            case 'daily':
                $from->modify('-1 day');
                break;
            case 'yearly':
                $from->modify('-1 year');
                break;
            case 'monthly':
            default:
                $from->modify('-1 month');
                break;
        }

        return [
            'from' => $from->format('Y-m-d'),
            'to' => $to->format('Y-m-d')
        ];
    }

    public function getValidBestsellerProducts()
    {
        $collection = $this->getBestsellerProduct();
        $validProducts = [];
        $limit = $this->getProductLimit();

        foreach ($collection as $item) {
            if (count($validProducts) >= $limit) {
                break;
            }

            try {
                $product = $this->productRepository->getById(
                    $item->getProductId(),
                    false,
                    $this->storeManager->getStore()->getId()
                );

                if ($product->getId() &&
                    $product->getStatus() == \Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED &&
                    in_array($product->getVisibility(), [
                        Visibility::VISIBILITY_BOTH,
                        Visibility::VISIBILITY_IN_CATALOG,
                        Visibility::VISIBILITY_IN_SEARCH
                    ])
                ) {
                    $validProducts[] = $product;
                }
            } catch (NoSuchEntityException $e) {
                continue;
            }
        }

        return $validProducts;
    }

    public function getLoadProduct($id)
    {
        try {
            return $this->productRepository->getById($id, false, $this->storeManager->getStore()->getId());
        } catch (NoSuchEntityException $e) {
            return null;
        }
    }

    public function getProductLimit()
    {
        $count = $this->getData('productcount');
        return $count ? (int)$count : self::DEFAULT_PRODUCTS_COUNT;
    }

    public function getProductimagewidth()
    {
        $width = $this->getData('imagewidth');
        return $width ? (int)$width : self::DEFAULT_IMAGE_WIDTH;
    }

    public function getProductimageheight()
    {
        $height = $this->getData('imageheight');
        return $height ? (int)$height : self::DEFAULT_IMAGE_HEIGHT;
    }

    public function isCarouselEnabled()
    {
        return (bool)$this->getData('enable_carousel');
    }

    public function getProductsPerSlide()
    {
        $perSlide = $this->getData('products_per_slide');
        return $perSlide ? (int)$perSlide : self::DEFAULT_PRODUCTS_PER_SLIDE;
    }

    public function getAutoplaySpeed()
    {
        $speed = $this->getData('autoplay_speed');
        return $speed ? (int)$speed : self::DEFAULT_AUTOPLAY_SPEED;
    }

    public function getPeriod()
    {
        $period = $this->getData('period');
        return $period ?: self::DEFAULT_PERIOD;
    }

    public function getAddToCartUrl($product, $additional = [])
    {
        return $this->cartHelper->getAddUrl($product, $additional);
    }

    public function getProductPriceHtml(
        ProductInterface $product,
        $priceType = null,
        $renderZone = \Magento\Framework\Pricing\Render::ZONE_ITEM_LIST,
        array $arguments = []
    ) {
        if (!isset($arguments['zone'])) {
            $arguments['zone'] = $renderZone;
        }

        $arguments['price_id'] = $arguments['price_id'] ?? 'old-price-' . $product->getId() . '-' . $priceType;
        $arguments['include_container'] = $arguments['include_container'] ?? true;
        $arguments['display_minimal_price'] = $arguments['display_minimal_price'] ?? true;

        $priceRender = $this->getLayout()->getBlock('product.price.render.default');

        $price = '';
        if ($priceRender) {
            $price = $priceRender->render(
                \Magento\Catalog\Pricing\Price\FinalPrice::PRICE_CODE,
                $product,
                $arguments
            );
        }

        return $price;
    }

    public function getCarouselConfig()
    {
        return [
            'enabled' => $this->isCarouselEnabled(),
            'productsPerSlide' => $this->getProductsPerSlide(),
            'autoplaySpeed' => $this->getAutoplaySpeed()
        ];
    }
}
