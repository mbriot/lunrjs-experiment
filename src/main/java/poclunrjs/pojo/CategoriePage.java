package poclunrjs.pojo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class CategoriePage implements Serializable {

    private List<Product> products = new ArrayList<>();

    private List<Filter> filters = new ArrayList<>();

    private long genTime;

    public long getGenTime() {
        return genTime;
    }

    public void setGenTime(long genTime) {
        this.genTime = genTime;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public List<Filter> getFilters() {
        return filters;
    }

    public void setFilters(List<Filter> filters) {
        this.filters = filters;
    }
}
