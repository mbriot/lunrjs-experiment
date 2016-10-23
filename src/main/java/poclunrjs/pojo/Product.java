package poclunrjs.pojo;

import java.io.Serializable;

public class Product implements Serializable {

    private String productId;

    private String productName;

    private String imageUrl;

    private String wordToIndex = "";

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void addWordToIndex(String value) {
        this.wordToIndex = this.wordToIndex + " " + value.replaceAll(" ","");
    }

    public String getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getWordToIndex() {
        return wordToIndex;
    }
}
