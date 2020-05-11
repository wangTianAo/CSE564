from flask import Flask, jsonify
import numpy as np
import json
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.manifold import MDS
from sklearn import metrics
from flask_cors import CORS
import math

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/KMeansElbow', methods=['POST', 'GET'])
def KMeansElbow():
    data = pd.read_csv("https://raw.githubusercontent.com/wangTianAo/CSE564/master/hm2/pokemon_alopez247.csv")
    data = data.drop(['Number'], axis=1)
    data = data.drop(['Name'], axis=1)
    number = []
    distortions = []
    for k in range(1, 16):
        kmeans = KMeans(n_clusters=k)
        kmeans = kmeans.fit(data)
        number.append(k)
        distortions.append(kmeans.inertia_)
    elbowData = pd.DataFrame([], columns=['x', 'y'])
    elbowData['x'] = number
    elbowData['y'] = distortions
    elbowData = elbowData.to_dict(orient='records')
    elbowData = {'data': elbowData}
    return jsonify(elbowData)

@app.route('/ScreePlotRandomSamplingPCA', methods=['POST', 'GET'])
def ScreePlotRandomSamplingPCA():
    data = RandomSampling()
    data = StandardScaler().fit_transform(data)
    pca = PCA(n_components=11)
    pcaData = pca.fit_transform(data)
    result =  pd.DataFrame([],columns=['x','y'])
    result['x'] = list(range(1,12))
    result['y'] = list(pca.explained_variance_ratio_)
    result = result.to_dict(orient='records')
    result = {'data': result}
    return jsonify(result)

@app.route('/ScreePlotStratifiedSamplingPCA', methods=['POST', 'GET'])
def ScreePlotStratifiedSamplingPCA():
    data = StratifiedSampling()
    data = data.drop(['clusters'], axis=1)
    data = StandardScaler().fit_transform(data)
    pca = PCA(n_components=11)
    pcaData = pca.fit_transform(data)
    result = pd.DataFrame([],columns=['x','y'])
    result['x'] = list(range(1,12))
    result['y'] = list(pca.explained_variance_ratio_)
    result = result.to_dict(orient='records')
    result = {'data': result}
    return jsonify(result)

@app.route('/ScreePlotOriginalPCA', methods=['POST', 'GET'])
def ScreePlotOriginalPCA():
    data = OriginalData()
    data = StandardScaler().fit_transform(data)
    pca = PCA(n_components=11)
    pcaData = pca.fit_transform(data)
    result = pd.DataFrame([],columns=['x','y'])
    result['x'] = list(range(1,12))
    result['y'] = list(pca.explained_variance_ratio_)
    result = result.to_dict(orient='records')
    result = {'data': result}
    return jsonify(result)

@app.route('/ScatterplotforOriginalPCA', methods=['POST', 'GET'])
def ScatterplotforOriginPCA():
    data = OriginalData()
    data = StandardScaler().fit_transform(data)
    pca = PCA(n_components=2)
    pcaData = pca.fit_transform(data)
    result = pd.DataFrame(pcaData,columns=['x','y'])
    result = result.to_dict(orient='records')
    result = {'data': result}
    return jsonify(result)

@app.route('/ScatterplotforRandomPCA', methods=['POST', 'GET'])
def ScatterplotforRandomPCA():
    data = RandomSampling()
    data = StandardScaler().fit_transform(data)
    pca = PCA(n_components=2)
    pcaData = pca.fit_transform(data)
    result = pd.DataFrame(pcaData,columns=['x','y'])
    result = result.to_dict(orient='records')
    result = {'data': result}
    return jsonify(result)

@app.route('/ScatterplotforStratifiedSamplingPCA', methods=['POST', 'GET'])
def ScatterplotforStratifiedSamplingPCA():
    data = StratifiedSampling()
    clusters_columns = data["clusters"]
    data = data.drop(["clusters"],axis=1);
    data = StandardScaler().fit_transform(data)
    pca = PCA(n_components=2)
    pcaData = pca.fit_transform(data)
    number = math.ceil(data.shape[0])
    pcaData = np.append(pcaData, clusters_columns.values.reshape(number, 1), axis=1)
    result = pd.DataFrame(pcaData,columns=['x','y','cluster'])
    result = result.to_dict(orient='records')
    result = {'data': result}
    return jsonify(result)

# @app.route('/GetHighestTopThreePCALoading', methods=['POST','GET'])
# def GetHighestTopThreePCALoading():
#     data = pd.read_csv("https://raw.githubusercontent.com/wangTianAo/CSE564/master/hm2/pokemon_alopez247.csv")
#     data = data.drop(['Number'], axis=1)
#     data = data.drop(['Name'], axis=1)
#     stddata = StandardScaler().fit_transform(data)
#     pca = PCA(n_components=3)
#     pcaData = pca.fit_transform(stddata)
#     pcaLoading = pd.DataFrame(data=pca.components_.T,columns=['PC1','PC2','PC3'])
#     pcaLoading.insert(loc=0,column='Attr',value = list(data))
#     pcaLoading['PCALoading'] = pcaLoading.drop(['Attr'],axis=1).apply(np.square).sum(axis=1)
#     print(pcaLoading)
#     sortedPCA = pcaLoading.sort_values(by=['PCALoading'], ascending=False)[:3]
#     print(sortedPCA)
#     print(sortedPCA['Attr'])
#     result = sortedPCA.to_dict(orient='records')
#     result = {'data': result}
#     return jsonify(result)

def getTopThreePCALoading(data,component):
    stddata = StandardScaler().fit_transform(data)
    pca = PCA(n_components=component)
    pcaData = pca.fit_transform(stddata)

    if(component==5):
        pcaLoading = pd.DataFrame(data=pca.components_.T, columns=['PC1', 'PC2', 'PC3','PC4','PC5'])
    else:
        pcaLoading = pd.DataFrame(data=pca.components_.T, columns=['PC1', 'PC2', 'PC3','PC4','PC5','PC6'])

    pcaLoading.insert(loc=0, column='Attr', value=list(data))
    pcaLoading['PCALoading'] = pcaLoading.drop(['Attr'], axis=1).apply(np.square).sum(axis=1)
    sortedPCA = pcaLoading.sort_values(by=['PCALoading'], ascending=False)[:3]
    # print(sortedPCA)
    temp = sortedPCA.values.tolist()
    result = [temp[0][0],temp[1][0],temp[2][0]];
    return result;

@app.route('/scatterPlotMatrixOriginal', methods=['POST', 'GET'])
def scatterPlotMatrixOriginal():
    data = OriginalData();
    top3 = getTopThreePCALoading(data,6);
    columns = ['Type_2', 'Total', 'HP', 'Attack', 'Sp_Atk', 'Sp_Def', 'isLegendary', 'Generation', 'Speed', 'Type_1',
               'Defense'];
    for i in top3:
        columns.remove(i);
    data = data.drop(columns, axis=1)
    result = data.to_dict(orient='records')
    result = {'data': result}
    return jsonify(result)

@app.route('/scatterPlotMatrixRandomSampling', methods=['POST', 'GET'])
def scatterPlotMatrixRandomSampling():
    data = RandomSampling();
    top3 = getTopThreePCALoading(data,5);
    columns = ['Type_2', 'Total', 'HP', 'Attack', 'Sp_Atk', 'Sp_Def', 'isLegendary', 'Generation', 'Speed', 'Type_1',
               'Defense'];
    for i in top3:
        columns.remove(i);
    data = data.drop(columns, axis=1)
    result = data.to_dict(orient='records')
    result = {'data': result}
    return jsonify(result)

@app.route('/scatterPlotMatrixStratifiedSampling', methods=['POST', 'GET'])
def scatterPlotMatrixStratifiedSampling():
    data = StratifiedSampling()
    clusters_columns = data["clusters"]
    data = data.drop(["clusters"], axis=1);
    top3 = getTopThreePCALoading(data,5);
    columns = ['Type_2', 'Total', 'HP', 'Attack', 'Sp_Atk', 'Sp_Def', 'isLegendary', 'Generation', 'Speed', 'Type_1',
               'Defense'];
    for i in top3:
        columns.remove(i);
    data = data.drop(columns, axis=1)
    number = math.ceil(data.shape[0])
    data['clusters'] = clusters_columns
    result = data.to_dict(orient='records')
    result = {'data': result}
    return jsonify(result)

@app.route('/scatterPlotStratifiedSamplingMDSCor', methods=['POST', 'GET'])
def scatterPlotStratifiedSamplingMDSCor():
    data = StratifiedSampling()
    clusters_columns = data["clusters"]
    data = data.drop(["clusters"], axis=1);
    data = StandardScaler().fit_transform(data)
    matrix = metrics.pairwise_distances(data,metric="correlation")
    mds = MDS(n_components=2,dissimilarity="precomputed")
    mdsData = mds.fit_transform(matrix)
    number = math.ceil(data.shape[0])
    mdsData = np.append(mdsData, clusters_columns.values.reshape(number, 1), axis=1)
    result = pd.DataFrame(mdsData,columns=['x','y','cluster'])
    result = result.to_dict(orient='records')
    result = {'data': result}
    return jsonify(result)

@app.route('/scatterPlotOriginalMDSCor', methods=['POST', 'GET'])
def scatterPlotOriginalMDSCor():
    data = OriginalData()
    data = StandardScaler().fit_transform(data)
    matrix = metrics.pairwise_distances(data,metric="correlation")
    mds = MDS(n_components=2,dissimilarity="precomputed")
    mdsData = mds.fit_transform(matrix)
    result = pd.DataFrame(data=mdsData, columns=['x','y'])
    result = result.to_dict(orient='records')
    result = {'data': result}
    return jsonify(result)


@app.route('/scatterPlotRandomMDSCor', methods=['POST', 'GET'])
def scatterPlotRandomMDSCor():
    data = RandomSampling()
    data = StandardScaler().fit_transform(data)
    matrix = metrics.pairwise_distances(data,metric="correlation")
    mds = MDS(n_components=2,dissimilarity="precomputed")
    mdsData = mds.fit_transform(matrix)
    result = pd.DataFrame(data=mdsData, columns=['x','y'])
    result = result.to_dict(orient='records')
    result = {'data': result}
    return jsonify(result)

@app.route('/scatterPlotOriginalMDSEuc', methods=['POST', 'GET'])
def scatterPlotOriginalMDSEuc():
    data = OriginalData()
    data = StandardScaler().fit_transform(data)
    mds = MDS(n_components=2,dissimilarity="euclidean")
    mdsData = mds.fit_transform(data)
    result = pd.DataFrame(data=mdsData, columns=['x','y'])
    result = result.to_dict(orient='records')
    result = {'data': result}
    return jsonify(result)

@app.route('/scatterPlotRandomMDSEuc', methods=['POST', 'GET'])
def scatterPlotRandomMDSEuc():
    data = RandomSampling()
    data = StandardScaler().fit_transform(data)
    mds = MDS(n_components=2,dissimilarity="euclidean")
    mdsData = mds.fit_transform(data)
    result = pd.DataFrame(data=mdsData, columns=['x','y'])
    result = result.to_dict(orient='records')
    result = {'data': result}
    return jsonify(result)

@app.route('/scatterPlotStratifiedSamplingMDSEuc', methods=['POST', 'GET'])
def scatterPlotStratifiedSamplingMDSEuc():
    data = StratifiedSampling()
    clusters_columns = data["clusters"]
    data = data.drop(["clusters"], axis=1);
    data = StandardScaler().fit_transform(data)
    mds = MDS(n_components=2,dissimilarity="euclidean")
    mdsData = mds.fit_transform(data)
    number = math.ceil(data.shape[0])
    mdsData = np.append(mdsData, clusters_columns.values.reshape(number, 1), axis=1)
    result = pd.DataFrame(mdsData,columns=['x','y','cluster'])
    result = result.to_dict(orient='records')
    result = {'data': result}
    return jsonify(result)

def OriginalData():
    data = pd.read_csv("https://raw.githubusercontent.com/wangTianAo/CSE564/master/hm2/pokemon_alopez247.csv")
    data = data.drop(['Number'], axis=1)
    data = data.drop(['Name'], axis=1)
    return data;

def RandomSampling():
    data = pd.read_csv("https://raw.githubusercontent.com/wangTianAo/CSE564/master/hm2/pokemon_alopez247.csv")
    data = data.drop(['Number'], axis=1)
    data = data.drop(['Name'], axis=1)
    number = math.ceil(data.shape[0] / 4)
    data = data.sample(number)
    return data

def StratifiedSampling():
    data = pd.read_csv("https://raw.githubusercontent.com/wangTianAo/CSE564/master/hm2/pokemon_alopez247.csv")
    data = data.drop(['Number'], axis=1)
    data = data.drop(['Name'], axis=1)
    number = math.ceil(data.shape[0] / 4)
    kmeans = KMeans(n_clusters=4)
    kmeans = kmeans.fit(data)
    data['clusters'] = kmeans.labels_
    cluster0 = data[data['clusters'] == 0].sample(number // 4)
    cluster1 = data[data['clusters'] == 1].sample(number // 4)
    cluster2 = data[data['clusters'] == 2].sample(number // 4)
    cluster3 = data[data['clusters'] == 3].sample(number - (number // 4)*3)
    StratifiedSamplingData = pd.DataFrame([], columns=['Type_1', 'Type_2', 'Total', 'HP', 'Attack', 'Defense', 'Sp_Atk','Sp_Def', 'Speed', 'Generation' , 'isLegendary','clusters'])
    StratifiedSamplingData = StratifiedSamplingData.append(cluster0,ignore_index=True)
    StratifiedSamplingData = StratifiedSamplingData.append(cluster1, ignore_index=True)
    StratifiedSamplingData = StratifiedSamplingData.append(cluster2, ignore_index=True)
    StratifiedSamplingData = StratifiedSamplingData.append(cluster3, ignore_index=True)
    # StratifiedSamplingData = StratifiedSamplingData.drop(['clusters'], axis=1)
    return StratifiedSamplingData

if __name__ == '__main__':
    app.run()
