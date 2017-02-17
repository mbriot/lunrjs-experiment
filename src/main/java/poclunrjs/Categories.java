package poclunrjs;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cache.annotation.Cacheable;
import poclunrjs.pojo.Filter;
import poclunrjs.pojo.FilterValue;
import poclunrjs.pojo.Product;
import poclunrjs.pojo.CategoriePage;
import poclunrjs.pojo.categoriesPOJO.*;
import poclunrjs.pojo.categoriesPOJO.SparkowProduct;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static poclunrjs.Util.SparkowConstant.*;

public class Categories {

    private SparkowRequester sparkowRequester;

    @Cacheable(value="categoriesCache", key="#categorieId")
    public CategoriePage getCategorieInformations(String categorieId) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String response = sparkowRequester.requestSparkow("C-" + categorieId + "/I-Page1_2000");
        SparkowCategorieResponse sparkowCategorieResponse = mapper.readValue(response, SparkowCategorieResponse.class);

        String webLabelCode;
        String imageUrlCode;
        String productUrlCode;
        Map<String, String> labelFromCodeAttribute = new HashMap<>();
        Map<String, String> codeFromLabelAttribute = new HashMap<>();
        getCodeAndLabelsMap(sparkowCategorieResponse, labelFromCodeAttribute, codeFromLabelAttribute);
        webLabelCode = labelFromCodeAttribute.get(LIBELLE_WEB.getLabel());
        productUrlCode = labelFromCodeAttribute.get(PRODUCT_URL.getLabel());
        imageUrlCode = labelFromCodeAttribute.get(IMAGE_URL.getLabel());

        List<Product> products = new ArrayList<>();
        List<Filter> filters = new ArrayList<>();
        List<SparkowFilter> sparkowFilters = new ArrayList<>();
        List<SparkowProduct> sparkowProducts = new ArrayList<>();

        for (SparkowZone sparkowZone : sparkowCategorieResponse.getSparkowZones()) {
            if ("Main".equals(sparkowZone.getName())) {
                for (SparkowControl sparkowControl : sparkowZone.getSparkowControls()) {
                    if (sparkowControl != null && "NextFilters:Compario.FrontAPI.ContentModels".equals(sparkowControl.getType())) {
                        sparkowFilters = sparkowControl.getSparkowFilters();
                    }
                    if (sparkowControl != null && "HierarchyListing:Compario.FrontAPI.ContentModels".equals(sparkowControl.getType())) {
                        sparkowProducts = sparkowControl.getProducts();
                    }
                }
            }
        }

        for (SparkowFilter sparkowFilter : sparkowFilters) {
            String code = sparkowFilter.getCode();
            List<SparkowFilterValue> values = sparkowFilter.getSparkowFilterValues();
            Filter filter = new Filter();
            filter.setFilterName(codeFromLabelAttribute.get(code));
            for (SparkowFilterValue value : values) {
                FilterValue filterValue = new FilterValue(value.getLabel(), value.getUrl());
                filter.getValues().add(filterValue);
            }
            filters.add(filter);
        }

        for (SparkowProduct sparkowProduct : sparkowProducts) {
            Product product = new Product();
            List<SparkowAttribute> sparkowAttributes = sparkowProduct.getSparkowAttributes();
            for (SparkowAttribute sparkowAttribute : sparkowAttributes) {
                if (productUrlCode.equals(sparkowAttribute.getAttributeDefinitionCode())) {
                    String productId = getProductIdFromURL(sparkowAttribute.getValue());
                    product.setProductId(productId);
                } else if (imageUrlCode.equals(sparkowAttribute.getAttributeDefinitionCode())) {
                    product.setImageUrl("http://decathlon.fr/media/" + sparkowAttribute.getValue());
                } else if (webLabelCode.equals(sparkowAttribute.getAttributeDefinitionCode())) {
                    product.setProductName(sparkowAttribute.getValue());
                }

                String attributeName = codeFromLabelAttribute.get(sparkowAttribute.getAttributeDefinitionCode());
                if(filters.contains(new Filter(attributeName))){
                    product.addWordToIndex(sparkowAttribute.getValue());
                }
            }
            products.add(product);
        }

        CategoriePage categoriePage = new CategoriePage();
        categoriePage.setProducts(products);
        categoriePage.setFilters(filters);
        return categoriePage;
    }

    private static void getCodeAndLabelsMap(SparkowCategorieResponse sparkowCategorieResponse,
                                            Map<String, String> labelFromCode, Map<String, String> codeFromLabel) {
        for (SparkowControl sparkowControl : sparkowCategorieResponse.getSparkowHeader().getSparkowControls()) {
            if ("FlowAttributeDefinitions:Compario.FrontAPI.ContentModels".equals(sparkowControl.getType())) {
                for (SparkowAttributeDefinition sparkowAttributeDefinition : sparkowControl.getSparkowAttributeDefinitions()) {
                    if (sparkowAttributeDefinition.getCode().startsWith("N")) {
                        labelFromCode.put(sparkowAttributeDefinition.getLabel(), sparkowAttributeDefinition.getCode());
                        codeFromLabel.put(sparkowAttributeDefinition.getCode(), sparkowAttributeDefinition.getLabel());
                    }
                }
            }
        }
    }

    private static String getProductIdFromURL(String value) {
        Pattern pattern = Pattern.compile(".*_(.+).html");
        Matcher m = pattern.matcher(value);
        String result = "";
        while (m.find()) {
            result = m.group(1);
        }
        return result;
    }

    public Categories(SparkowRequester sparkowRequester) {
        this.sparkowRequester = sparkowRequester;
    }
}
