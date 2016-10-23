package poclunrjs.pojo.categoriesPOJO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SparkowControl {

    @JsonProperty("__type")
    private String type;

    @JsonProperty("Id")
    private String id;

    @JsonProperty("Hierarchy")
    private SparkowHierarchy sparkowHierarchy;

    @JsonProperty("Products")
    private List<SparkowProduct> products = new ArrayList<SparkowProduct>();

    @JsonProperty("Attributes")
    private List<SparkowAttributeDefinition> sparkowAttributeDefinitions = new ArrayList<SparkowAttributeDefinition>();

    @JsonProperty("Filters")
    private List<SparkowFilter> sparkowFilters = new ArrayList<SparkowFilter>();

    public String getType() {
        return type;
    }

    public SparkowHierarchy getSparkowHierarchy() {
        return sparkowHierarchy;
    }

    public List<SparkowProduct> getProducts() {
        return products;
    }

    public String getId() {
        return id;
    }

    public List<SparkowAttributeDefinition> getSparkowAttributeDefinitions() {
        return sparkowAttributeDefinitions;
    }

    public List<SparkowFilter> getSparkowFilters() {
        return sparkowFilters;
    }
}
